import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

interface RequestBody {
  name: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY ;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
  }

  try {
    const body = await request.json() as RequestBody;
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'No name provided' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Use the updated prompt without urlOfImage
const prompt = `You're an intelligent AI designed to identify whether the input "${name}" is a person, place, or thing.

Step 1: Classify what "${name}" is — a person, place, or thing — and describe it briefly in 1–2 sentences.

Step 2: Write a short paragraph explaining what makes "${name}" notable — its impact, fame, or importance.

Step 3: Based on your classification:

- If it's a real person, recommend 10 similar people:
    - At least 3 from the same country/region,
    - At least 3 global figures from the same industry/field,
    - At least 3 people from the same historical period.

- If it's a fictional character (from anime, comics, games, etc.), classify it as a person, not a thing. Recommend similar characters based on genre, role, and era — not shows or franchises.

- If it's a place, recommend 10 similar places:
    - At least 3 from the same region/country,
    - At least 3 global equivalents (same importance/function),
    - At least 3 from the same time period or architectural style.

- If it's a thing (brand, concept, object, etc.), recommend 10 similar things based on category, purpose, or theme.

Step 4: Estimate the "auraMeter" score — a number from 1 to 100 reflecting the overall popularity, influence, and cultural relevance of "${name}".

Step 5: Explain the score briefly in "auraReason" — 1–2 sentences explaining why you assigned that auraMeter value.

Respond ONLY in the following strict JSON format:
{
  "name": "${name}",
  "description": "<Your description identifying if it's a person/place/thing.>",
  "claimToFame": "<Short paragraph explaining its notability.>",
  "recommendedHashtags": "#Entity1, #Entity2, #Entity3, #Entity4, #Entity5, #Entity6, #Entity7, #Entity8, #Entity9, #Entity10",
  "auraMeter": <number from 1 to 100>,
  "auraReason": "<Short justification for the auraMeter score.>"
}

Formatting Rules:
- Only comma-separated entity names as hashtags in "recommendedHashtags" — no extra text.
- Do not mix categories (person → people, place → places, etc.).
- Output must be plain text JSON, no markdown or HTML.`
;
 // Insert the updated prompt here

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: [{ text: prompt }],
    });

    const rawOutput = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let jsonOutput;
    try {
      jsonOutput = JSON.parse(rawOutput);
    } catch (e) {
      const match = rawOutput.match(/\{[\s\S]*?\}/);
      if (match) {
        jsonOutput = JSON.parse(match[0]);
      } else {
        throw new Error(`AI response is not valid JSON: ${e}\n${rawOutput}`);
      }
    }

    // Fetch image from Unsplash API
    const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
    const unsplashResponse = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(name)}&client_id=${unsplashAccessKey}&per_page=1`
    );
    const unsplashData = await unsplashResponse.json();

    let imageUrl = null;
    if (unsplashData?.results?.length > 0) {
    imageUrl = unsplashData.results[0].urls?.regular;
    }
    if (imageUrl) {
      jsonOutput.imageUrl = imageUrl;
    } else {
      jsonOutput.imageUrl = 'https://via.placeholder.com/150'; // Fallback image
    }
    // Fetch image from Wikipedia API
    return NextResponse.json({
      name,
      ...jsonOutput,
      urlOfImage: imageUrl,
    });

  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ error }, { status: 500 });
  }
}
