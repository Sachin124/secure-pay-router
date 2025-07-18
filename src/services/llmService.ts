// src/services/llmService.ts
import dotenv from 'dotenv';
dotenv.config();

// If using Node 18+, fetch is available globally. If not, uncomment the next line:
// import fetch from 'node-fetch';

export async function generateExplanation(score: number, reasons: string[], provider?: string): Promise<string> {
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
          { role: 'user', content: `Fraud score: ${score}\nReasons: ${reasons.join(', ')}\nExplain in one sentence why this payment was ${score >= 0.5 ? 'blocked' : `routed to ${provider}`} in natural language.` }
        ],
        max_tokens: 60,
        temperature: 0.7
      })
    });

    const result = await response.json();
    return 'Groq API response: ' + result.choices?.[0]?.message?.content?.trim() || fallbackExplanation(score, reasons, provider);
  } catch (err) {
    console.error('Groq API error:', err);
    return fallbackExplanation(score, reasons, provider);
  }
}

function fallbackExplanation(score: number, reasons: string[], provider?: string): string {
  if (score >= 0.5) {
    return `This payment was blocked due to a high risk score based on: ${reasons.join(', ')}.`;
  } else if (provider === 'paypal' || provider === 'stripe') {
    return `This payment was routed to ${provider?.charAt(0).toUpperCase() + provider?.slice(1)} due to a low risk score based on: ${reasons.join(', ')}.`;
  } else {
    return `This payment was allowed due to a low risk score based on: ${reasons.join(', ')}.`;
  }
}
