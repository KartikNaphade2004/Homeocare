import { Message } from './../../../node_modules/openai/resources/beta/threads/messages.d';
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ResponseData {
    suggestion?: string;
    error?: string;
    message?: string;  
  }
  
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const { answers } = req.body;
    const formattedAnswers = Object.values(answers).join('\n');

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful homeopathic expert.',
          },
          {
            role: 'user',
            content: `Based on the following detailed patient information, suggest a suitable homeopathic medicine:\n${formattedAnswers}`,
          },
        ],
        max_tokens: 150,
      });

      const suggestion = response.choices[0].message?.content?.trim() || 'No suggestion available.';
      res.status(200).json({ suggestion });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
