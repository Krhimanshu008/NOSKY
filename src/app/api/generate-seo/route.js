import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';

async function attemptModelGeneration(ai, model, prompt, system_instruction) {
  try {
    const interaction = await ai.interactions.create({
      model: model,
      input: prompt,
      system_instruction: system_instruction
    });

    const text = interaction.output_text;

    // Parse the JSON string
    const seoData = JSON.parse(text);

    // If successful, return the data
    if (seoData) {
      console.log(`Successfully generated SEO with model: ${model}`);
      return { seoData, error: null };
    }
    return { seoData: null, error: new Error('Parsed data is empty') };
  } catch (error) {
    console.warn(`Model ${model} failed, trying next... Error:`, error.message);
    return { seoData: null, error };
  }
}

export async function POST(request) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_google')) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured in .env' }, { status: 500 });
    }

    // Initialize the new GoogleGenAI SDK
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Priority list of models with backups
    const fallbackModels = [
      'gemini-3.0-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
      'gemma-4-31b',
      'gemma-4-26b'
    ];

    const prompt = `Analyze the following article and generate SEO metadata. 
Title: ${title}
Content: ${content}`;

    const system_instruction = `You are an SEO expert. Output ONLY valid JSON matching this schema exactly:
{
  "type": "object",
  "properties": {
    "metaDescription": {
      "type": "string",
      "description": "A concise SEO meta description under 160 characters summarizing the article."
    },
    "metaKeywords": {
      "type": "string",
      "description": "A comma-separated list of 5-8 relevant SEO keywords for the article."
    },
    "geoRegion": {
      "type": "string",
      "description": "The primary geographic region mentioned (e.g., India, Middle East, Europe), or empty string if not applicable."
    },
    "cityLocation": {
      "type": "string",
      "description": "The primary city mentioned (e.g., Mumbai, Dubai), or empty string if not applicable."
    }
  },
  "required": ["metaDescription", "metaKeywords", "geoRegion", "cityLocation"]
}`;

    let lastError = null;
    let seoData = null;

    for (const model of fallbackModels) {
      const result = await attemptModelGeneration(ai, model, prompt, system_instruction);

      if (result.seoData) {
        seoData = result.seoData;
        break;
      }

      lastError = result.error;
    }

    if (!seoData) {
      throw new Error(`All models failed. Last error: ${lastError?.message}`);
    }

    return NextResponse.json(seoData);
  } catch (error) {
    console.error('Error generating SEO:', error);
    return NextResponse.json({ error: 'Failed to generate SEO: ' + error.message }, { status: 500 });
  }
}
