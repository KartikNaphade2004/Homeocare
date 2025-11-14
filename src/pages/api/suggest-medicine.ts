import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

interface ResponseData {
    suggestion?: string;
    error?: string;
    message?: string;  
  }

// Free rule-based homeopathic suggestion system
function getFreeHomeopathicSuggestion(answers: Record<string, string>): string {
  const text = Object.values(answers).join(' ').toLowerCase();
  
  // Common symptoms and their homeopathic remedies
  const remedies: { keywords: string[]; medicine: string; description: string }[] = [
    {
      keywords: ['fever', 'high temperature', 'hot', 'burning'],
      medicine: 'Belladonna',
      description: 'For sudden high fever with flushed face and hot skin. Often used for acute inflammatory conditions.'
    },
    {
      keywords: ['cold', 'chills', 'shivering', 'freezing'],
      medicine: 'Aconite',
      description: 'For sudden onset of colds with chills, anxiety, and restlessness. Best taken at the first sign of illness.'
    },
    {
      keywords: ['headache', 'head pain', 'migraine'],
      medicine: 'Bryonia',
      description: 'For headaches that worsen with movement. Also useful for headaches with irritability.'
    },
    {
      keywords: ['cough', 'coughing', 'dry cough'],
      medicine: 'Drosera',
      description: 'For spasmodic, dry coughs that are worse at night. Particularly effective for whooping cough-like symptoms.'
    },
    {
      keywords: ['diarrhea', 'loose stool', 'stomach upset'],
      medicine: 'Arsenicum Album',
      description: 'For diarrhea with burning sensations, restlessness, and anxiety. Often used for food poisoning symptoms.'
    },
    {
      keywords: ['anxiety', 'worried', 'fear', 'nervous'],
      medicine: 'Aconite',
      description: 'For sudden anxiety and panic attacks. Also helps with restlessness and fear.'
    },
    {
      keywords: ['insomnia', 'sleep', 'sleepless', 'trouble sleeping'],
      medicine: 'Coffea',
      description: 'For insomnia due to mental activity or excitement. Helps calm an overactive mind.'
    },
    {
      keywords: ['sore throat', 'throat pain', 'swallowing'],
      medicine: 'Phytolacca',
      description: 'For sore throats with difficulty swallowing. Particularly effective for right-sided throat pain.'
    },
    {
      keywords: ['joint pain', 'arthritis', 'stiffness', 'rheumatism'],
      medicine: 'Rhus Tox',
      description: 'For joint pain that is worse in the morning and improves with movement. Useful for arthritis and stiffness.'
    },
    {
      keywords: ['skin', 'rash', 'itching', 'eczema'],
      medicine: 'Sulphur',
      description: 'For various skin conditions including itching, rashes, and eczema. Often used for chronic skin problems.'
    },
    {
      keywords: ['digestive', 'indigestion', 'bloating', 'gas'],
      medicine: 'Nux Vomica',
      description: 'For digestive issues including indigestion, bloating, and constipation. Particularly useful after overeating.'
    },
    {
      keywords: ['stress', 'tension', 'pressure'],
      medicine: 'Ignatia',
      description: 'For emotional stress, grief, and mood swings. Helps with emotional sensitivity and stress-related symptoms.'
    }
  ];

  // Find matching remedy
  for (const remedy of remedies) {
    if (remedy.keywords.some(keyword => text.includes(keyword))) {
      return `Based on your symptoms, I recommend:\n\n**${remedy.medicine}**\n\n${remedy.description}\n\nPlease note: This is a general suggestion. For best results, consult with a qualified homeopathic practitioner who can provide personalized treatment based on your complete case history.\n\nDisclaimer: Homeopathic remedies should be used under proper guidance. This is not a substitute for professional medical advice.`;
    }
  }

  // Default suggestion if no specific match
  return `Based on the information you've provided, here are some general homeopathic considerations:\n\n**Arnica Montana** - Often called the "first aid" remedy, useful for trauma, shock, and physical injuries.\n\n**Chamomilla** - For pain and irritability, especially in sensitive individuals.\n\n**Pulsatilla** - For changeable symptoms and emotional sensitivity.\n\n**Nux Vomica** - For digestive issues and stress-related conditions.\n\n**Important Note:** Homeopathic treatment is highly individualized. The selection of a remedy depends on your complete symptom picture, constitution, and lifestyle. I strongly recommend consulting with a qualified homeopathic practitioner for proper diagnosis and treatment.\n\nDisclaimer: This information is for educational purposes only and is not intended to diagnose, treat, or cure any disease. Always consult with a healthcare professional before starting any treatment.`;
}
  
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const { answers } = req.body;
    
    // Validate input
    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ 
        error: 'No answers provided. Please fill out the form.' 
      });
    }

    // Try OpenAI API if configured and available
    if (openai && process.env.OPENAI_API_KEY) {
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
        return res.status(200).json({ suggestion });
      } catch (error: any) {
        console.error('OpenAI API error:', error);
        
        // Handle specific OpenAI API errors - fallback to free version on quota/auth errors
        const errorMessage = error?.message || '';
        const statusCode = error?.status || error?.response?.status || error?.statusCode;
        
        // Check for quota exceeded errors (429) - use free fallback
        if (statusCode === 429 || 
            errorMessage.toLowerCase().includes('quota') || 
            errorMessage.toLowerCase().includes('exceeded') ||
            errorMessage.includes('429')) {
          console.log('OpenAI quota exceeded, using free fallback');
          const freeSuggestion = getFreeHomeopathicSuggestion(answers);
          return res.status(200).json({ suggestion: freeSuggestion });
        }
        
        // Check for authentication errors (401) - use free fallback
        if (statusCode === 401 || 
            errorMessage.toLowerCase().includes('invalid api key') ||
            errorMessage.toLowerCase().includes('authentication')) {
          console.log('OpenAI authentication failed, using free fallback');
          const freeSuggestion = getFreeHomeopathicSuggestion(answers);
          return res.status(200).json({ suggestion: freeSuggestion });
        }
        
        // For other errors, try free fallback as well
        console.log('OpenAI API error occurred, using free fallback');
        const freeSuggestion = getFreeHomeopathicSuggestion(answers);
        return res.status(200).json({ suggestion: freeSuggestion });
      }
    } else {
      // No OpenAI API key configured - use free version
      console.log('Using free homeopathic suggestion system (no OpenAI API key)');
      const freeSuggestion = getFreeHomeopathicSuggestion(answers);
      return res.status(200).json({ suggestion: freeSuggestion });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
