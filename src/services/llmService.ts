// src/services/llmService.ts
import dotenv from 'dotenv';
dotenv.config();

import { fetchPaymentConfig } from '../config/paymentConfig';
import { getLLMCache, setLLMCache } from '../utils/llmCache';

// Use Node 18+ global fetch or uncomment this for older versions:
// import fetch from 'node-fetch';

export async function generateExplanation(
  score: number,
  reasons: string[],
  provider?: string
): Promise<string> {
  const prompt = await buildPrompt(score, reasons, provider);
  const cached = getLLMCache(prompt);
  if (cached) {
    return `Cached response: ${cached}`;
  }

  if (!process.env.GROQ_API_KEY) {
    return fallbackExplanation(score, reasons, provider);
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          { role: 'system', content: 'You are a payment risk analyst.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 60,
        temperature: 0.7
      })
    });

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content?.trim();

    if (!content) {
      console.error('Groq response missing content:', result);
      return fallbackExplanation(score, reasons, provider);
    }

    const finalResult = `Response from Groq: ${content}`;
    console.log('My Prompt', prompt);
    
    setLLMCache(prompt, finalResult);
    return finalResult;

  } catch (err) {
    console.error('Groq API error:', err);
    return fallbackExplanation(score, reasons, provider);
  }
}

// Extracted: Build Prompt based on config
async function buildPrompt(score: number, reasons: string[], provider?: string): Promise<string> {
  try {
    const config = await fetchPaymentConfig();
    const isBlocked = score >= config.blockScoreThreshold;
    const providerText = isBlocked ? config.status.blocked : `routed to ${provider}`;
    return `Fraud score: ${score}\nReasons: ${reasons.join(', ')}\nExplain in one sentence why this payment was ${providerText} in natural language.`;
  } catch (err) {
    console.error('Prompt build failed:', err);
    return `Fraud score: ${score}\nReasons: ${reasons.join(', ')}\nExplain this payment decision.`;
  }
}

// Safe and config-based fallback message
async function fallbackExplanation(score: number, reasons: string[], provider?: string): Promise<string> {
  try {
    const config = await fetchPaymentConfig();
    const { blockScoreThreshold, explanationMessages, availableGateways } = config;

    if (score >= blockScoreThreshold) {
      return explanationMessages.blocked.replace('{reasons}', reasons.join(', '));
    }

    if (provider && availableGateways.includes(provider)) {
      return explanationMessages.routed
        .replace('{provider}', capitalize(provider))
        .replace('{reasons}', reasons.join(', '));
    }

    return explanationMessages.allowed.replace('{reasons}', reasons.join(', '));

  } catch (err) {
    console.error('Config fetch failed in fallbackExplanation:', err);
    return 'Unable to generate explanation due to configuration error.';
  }
}

// Utility
function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
