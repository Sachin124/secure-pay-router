// src/services/llmService.ts
import dotenv from 'dotenv';
dotenv.config();

export async function generateExplanation(score: number, reasons: string[]): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    try {
      const { Configuration, OpenAIApi } = await import('openai');
      const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));
      const prompt = `Fraud score: ${score}\nReasons: ${reasons.join(', ')}\nExplain in one sentence why this payment was ${score >= 0.5 ? 'blocked' : 'allowed'}.`;
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a payment risk analyst.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 60
      });
      return response.data.choices[0].message?.content?.trim() || 'No explanation generated.';
    } catch (err) {
      console.error('OpenAI error:', err);
      // Fallback to simulated explanation
    }
  }
  // Simulated explanation
  if (score >= 0.5) {
    return `Blocked due to: ${reasons.join(' and ')}.`;
  } else {
    return `Allowed. Risk factors: ${reasons.join(' and ') || 'none'}.`;
  }
} 