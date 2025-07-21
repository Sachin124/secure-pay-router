// src/services/llmService.ts
import dotenv from 'dotenv';
dotenv.config();

// If using Node 18+, fetch is available globally. If not, uncomment the next line:
// import fetch from 'node-fetch';
import { fetchPaymentConfig } from '../config/paymentConfig';

export async function generateExplanation(score: number, reasons: string[], provider?: string): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    return await fallbackExplanation(score, reasons, provider);
  }

  try {
    const paymentConfig = await fetchPaymentConfig();
    const { blockScoreThreshold, status, availableGateways } = paymentConfig;
    const isBlocked = score >= blockScoreThreshold;
    const providerText = isBlocked ? status.blocked : `routed to ${provider}`;
    const prompt = `Fraud score: ${score}\nReasons: ${reasons.join(', ')}\nExplain in one sentence why this payment was ${providerText} in natural language.`;
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
    if (result.error || !result.choices?.[0]?.message?.content) {
      // Log the error for debugging
      console.error('Groq API error or missing content:', result.error || result);
      return fallbackExplanation(score, reasons, provider);
    }
    return "Response from Grok: " + result.choices[0].message.content.trim();
  } catch (err) {
    console.error('Groq API error:', err);
    return fallbackExplanation(score, reasons, provider);
  }
}

async function fallbackExplanation(score: number, reasons: string[], provider?: string): Promise<string> {
  try {
    const paymentConfig = await fetchPaymentConfig();
    const { blockScoreThreshold, availableGateways, explanationMessages } = paymentConfig;
    if (score >= blockScoreThreshold) {
      return explanationMessages.blocked.replace('{reasons}', reasons.join(', '));
    } else if (provider && availableGateways.includes(provider)) {
      return explanationMessages.routed
        .replace('{provider}', provider.charAt(0).toUpperCase() + provider.slice(1))
        .replace('{reasons}', reasons.join(', '));
    } else {
      return explanationMessages.allowed.replace('{reasons}', reasons.join(', '));
    }
  } catch (err) {
    console.error('Config fetch failed in fallbackExplanation:', err);
    return 'Unable to generate explanation due to configuration error.';
  }
}