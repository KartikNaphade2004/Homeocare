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
      
      // Handle specific OpenAI API errors
      const errorMessage = error?.message || '';
      const statusCode = error?.status || error?.response?.status || error?.statusCode;
      
      // Check for quota exceeded errors (429)
      if (statusCode === 429 || 
          errorMessage.toLowerCase().includes('quota') || 
          errorMessage.toLowerCase().includes('exceeded') ||
          errorMessage.includes('429')) {
        return res.status(429).json({ 
          error: 'API quota exceeded. Please check your OpenAI account billing and usage limits. Visit https://platform.openai.com/account/billing to add credits or upgrade your plan.' 
        });
      }
      
      // Check for authentication errors (401)
      if (statusCode === 401 || 
          errorMessage.toLowerCase().includes('invalid api key') ||
          errorMessage.toLowerCase().includes('authentication')) {
        return res.status(401).json({ 
          error: 'Invalid API key. Please check your OPENAI_API_KEY environment variable in Vercel settings.' 
        });
      }
      
      // Generic error handling
      const finalErrorMessage = errorMessage || 'An error occurred while processing your request.';
      res.status(500).json({ error: finalErrorMessage });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
