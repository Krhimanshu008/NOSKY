import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, existingTitle, existingContent } = await request.json();

    if (!prompt && !existingContent) {
      return NextResponse.json({ error: 'Prompt or existing content is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_google')) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured in .env' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Priority list of models with backups
    const fallbackModels = [
      'gemini-3.0-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
      'gemma-4-31b',
      'gemma-4-26b'
    ];

    let fullPrompt = `You are an expert article writer. `;
    if (existingContent || existingTitle) {
      fullPrompt += `Refine and improve the following article content and title based on this instruction: "${prompt || 'Make it better and professional'}".\n\nExisting Title: ${existingTitle || 'None'}\nExisting Content: ${existingContent || 'None'}`;
    } else {
      fullPrompt += `Write an article based on this prompt: "${prompt}".`;
    }

    const system_instruction = `Output ONLY valid JSON matching this schema exactly:
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "A catchy, SEO-friendly title for the article."
    },
    "slug": {
      "type": "string",
      "description": "A URL-friendly slug based on the title (lowercase, hyphen-separated)."
    },
    "content": {
      "type": "string",
      "description": "The full article content formatted in Markdown. Do NOT include the title as a heading inside this content body."
    }
  },
  "required": ["title", "slug", "content"]
}`;

    let lastError = null;
    let contentData = null;

    for (const model of fallbackModels) {
      try {
        const interaction = await ai.interactions.create({
          model: model,
          input: fullPrompt,
          system_instruction: system_instruction
        });

        const text = interaction.output_text;

        // Parse the JSON string
        contentData = JSON.parse(text);

        if (contentData) {
          console.log(`Successfully generated content with model: ${model}`);
          break;
        }
      } catch (error) {
        console.warn(`Model ${model} failed, trying next... Error:`, error.message);
        lastError = error;
        continue;
      }
    }

    if (!contentData) {
      throw new Error(`All models failed. Last error: ${lastError?.message}`);
    }

    return NextResponse.json(contentData);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate content.' }, { status: 500 });
  }
}
