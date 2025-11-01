import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model = 'gpt-4', max_tokens = 500, temperature = 0.7 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const completion = await openai.chat.completions.create({
      model,
      messages,
      max_tokens,
      temperature,
    });

    const message = completion.choices[0]?.message?.content || 'No response generated';

    res.status(200).json({ message });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: 'Failed to get response from OpenAI',
      details: error.message 
    });
  }
}
