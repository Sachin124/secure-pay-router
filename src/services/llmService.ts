// src/services/llmService.ts
import dotenv from 'dotenv';
dotenv.config();

let openai: any;

export async function generateExplanation(score: number, reasons: string[]): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    try {
      if (!openai) {
        // Dynamically require the module inside the function
        const { OpenAI } = require('openai');
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      }

      const prompt = `Fraud score: ${score}\nReasons: ${reasons.join(', ')}\nExplain in one sentence why this payment was ${score >= 0.5 ? 'blocked' : 'allowed'}.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a payment risk analyst.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 60
      });

      return response.choices[0].message.content.trim();

    } catch (err) {
      console.error('OpenAI API error:', err);
    }
  }

  // Fallback
  return score >= 0.5
    ? `Blocked due to: ${reasons.join(' and ')}.`
    : `Allowed. Risk factors: ${reasons.join(' and ') || 'none'}.`;
}
