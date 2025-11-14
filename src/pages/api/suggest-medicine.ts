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
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return res.status(500).json({ 
        error: 'API key is not configured. Please set OPENAI_API_KEY environment variable.' 
      });
    }

    const { answers } = req.body;
    
    // Validate input
    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ 
        error: 'No answers provided. Please fill out the form.' 
      });
    }

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
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      const errorMessage = error?.message || 'An error occurred while processing your request.';
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
