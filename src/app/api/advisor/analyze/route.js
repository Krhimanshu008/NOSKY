import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

async function attemptAnalysis(ai, model, input, system_instruction) {
  const interaction = await ai.interactions.create({
    model: model,
    input: input,
    system_instruction: system_instruction
  });

  const text = interaction.output_text;

  let jsonStr = text;
  if (text.startsWith('```json')) {
    jsonStr = text.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (text.startsWith('```')) {
    jsonStr = text.replace(/^```/, '').replace(/```$/, '').trim();
  }

  return JSON.parse(jsonStr);
}

export async function POST(request) {
  try {
    const { description, structured } = await request.json();

    if (!description && !structured) {
      return NextResponse.json({ error: 'Description or structured data is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_google')) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured in .env' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const fallbackModels = [
      'gemini-3.0-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
    ];

    let fullPrompt = `You are a data backup architecture expert. The user wants a backup strategy based on their business description and/or structured answers.

User Description:
${description || 'None provided'}

Structured Facts (these MUST be treated as authoritative and override inferences from the description):
- Primary Data Formats: ${structured?.formats?.length ? structured.formats.join(', ') : 'Not specified'}
- Current Data Size: ${structured?.currentSizeBand || 'Not specified'}
- Data Locations: ${structured?.locations?.length ? structured.locations.join(', ') : 'Not specified'}
- Retention Requirement: ${structured?.retention || 'Not specified'}

Analyze the inputs and return a JSON object with the requested properties.
For the "assumptions" field, return an array of strings detailing any facts you had to ASSUME because they were not specified by the user. If the user explicitly provided the fact, do NOT list it as an assumption.
For "customSoftware", list any software mentioned that is not a standard widely known tool, or just empty if none.
For "criticality", infer if the business stops without data ("Business stops (Minutes/Hours)" -> "hours") or can recreate it ("Can recreate (Days)" -> "few-days"). Defaults to "few-days".
For "teamSize", infer the team size if mentioned, otherwise assume "1-5".
`;

    const system_instruction = `Output ONLY valid JSON matching this schema exactly:
{
  "type": "object",
  "properties": {
    "industry": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Array of industries inferred, max 3. e.g. ['accounting', 'media']."
    },
    "softwareIds": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Array of lowercase standard software names inferred (e.g. ['photoshop', 'excel'])."
    },
    "customSoftware": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Array of custom or unrecognised software names."
    },
    "dataLocations": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Array of data locations, e.g. ['Local computers', 'NAS']."
    },
    "teamSize": {
      "type": "string",
      "description": "Estimated team size band, e.g. '1-5', '6-20', '21-50', '50+'"
    },
    "criticality": {
      "type": "string",
      "description": "Business criticality: 'few-days' or 'hours'"
    },
    "assumptions": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Any facts you had to assume because they were not provided. (e.g. 'Assumed 1-5 employees - not specified')"
    }
  },
  "required": ["industry", "softwareIds", "customSoftware", "dataLocations", "teamSize", "criticality", "assumptions"]
}`;

    let lastError = null;
    let contentData = null;

    for (const model of fallbackModels) {
      try {
        contentData = await attemptAnalysis(ai, model, fullPrompt, system_instruction);

        if (contentData) {
          console.log(`Successfully analyzed with model: ${model}`);
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
    console.error('Error analyzing backup needs:', error);
    return NextResponse.json({ error: 'Failed to analyze: ' + error.message }, { status: 500 });
  }
}
