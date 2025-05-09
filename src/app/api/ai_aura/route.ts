import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";

interface RequestBody {
  name: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const tavilyApiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
  }
  
  if (!tavilyApiKey) {
    return NextResponse.json({ error: 'Missing TAVILY_API_KEY' }, { status: 500 });
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

Step 1: Classify what "${name}" is — a real person, fictional character, place, or thing — and describe it briefly in 1–2 sentences.

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
  "type": "<person | fictional character | place | thing | brand>",
  "description": "<Your description identifying what it is.>",
  "claimToFame": "<Short paragraph explaining its notability.>",
  "recommendedHashtags": "#Entity1, #Entity2, #Entity3, #Entity4, #Entity5, #Entity6, #Entity7, #Entity8, #Entity9, #Entity10",
  "auraMeter": <number from 1 to 100>,
  "auraReason": "<Short justification for the auraMeter score.>"
}

Formatting Rules:
- Use one of the four values for "type": person, fictional character, place, thing.
- Only comma-separated entity names as hashtags in "recommendedHashtags" — no extra text.
- Do not mix categories (person → people, place → places, etc.).
- Output must be plain text JSON, no markdown or HTML.`;

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

    // Fetch image using Tavily API through LangChain based on entity type
    const retriever = new TavilySearchAPIRetriever({
      apiKey: tavilyApiKey,
      searchDepth: "advanced",
      k: 3,  // Increased to get more image options
      includeImages: true,
      includeRawContent: false,
    });
    
    // Create a more specific search query based on the entity type
    let searchQuery = '';
    const entityType = jsonOutput.type?.toLowerCase() || '';
    
    if (entityType === 'fictional character') {
      searchQuery = `official image of ${name} character anime manga`;
    } else if (entityType === 'person') {
      searchQuery = `official portrait photo of ${name} person`;
    } else if (entityType === 'place') {
      searchQuery = `high quality photograph of ${name} location`;
    } else if (entityType === 'brand' || entityType === 'thing') {
      searchQuery = `official logo or image of ${name} product brand`;
    } else {
      // Fallback for any other type
      searchQuery = `high quality image of ${name}`;
    }
    
    const searchResults = await retriever.getRelevantDocuments(searchQuery);
    
    let imageUrl = null;
    // Try to extract image URL from search results
    for (let i = 0; i < searchResults.length; i++) {
      if (searchResults[i].metadata.images && searchResults[i].metadata.images.length > 0) {
        // Get the first available image from each result
        imageUrl = searchResults[i].metadata.images[0];
        break;
      }
    }
    
    // If no image found, try a broader search
    if (!imageUrl) {
      const broadSearchQuery = `best image of ${name}`;
      const broadResults = await retriever.getRelevantDocuments(broadSearchQuery);
      
      for (let i = 0; i < broadResults.length; i++) {
        if (broadResults[i].metadata.images && broadResults[i].metadata.images.length > 0) {
          imageUrl = broadResults[i].metadata.images[0];
          break;
        }
      }
    }

    // Implement a final fallback if we still don't have an image
    if (!imageUrl) {
      // Try one last direct search with different parameters
      const lastResortRetriever = new TavilySearchAPIRetriever({
        apiKey: tavilyApiKey,
        searchDepth: "basic", // Try basic search which might return different results
        k: 5,
        includeImages: true,
        includeRawContent: false,
      });
      
      const lastResortQuery = `${name} image`;
      const lastResortResults = await lastResortRetriever.getRelevantDocuments(lastResortQuery);
      
      for (let i = 0; i < lastResortResults.length; i++) {
        if (lastResortResults[i].metadata.images && lastResortResults[i].metadata.images.length > 0) {
          imageUrl = lastResortResults[i].metadata.images[0];
          break;
        }
      }
    }
    
    if (imageUrl) {
      jsonOutput.imageUrl = imageUrl;
    } else {
      // Provide a fallback image based on entity type
      const fallbackImages = {
        'person': 'https://via.placeholder.com/400x400?text=Person+Image+Not+Found',
        'fictional character': 'https://via.placeholder.com/400x400?text=Character+Image+Not+Found',
        'place': 'https://via.placeholder.com/400x400?text=Place+Image+Not+Found',
        'thing': 'https://via.placeholder.com/400x400?text=Object+Image+Not+Found',
        'brand': 'https://via.placeholder.com/400x400?text=Brand+Logo+Not+Found',
        'default': 'https://via.placeholder.com/400x400?text=Image+Not+Found',
      };
      
      // Define the type to ensure entityType is a valid key
      type FallbackImageKey = keyof typeof fallbackImages;
      const entityType = (jsonOutput.type?.toLowerCase() || 'default') as FallbackImageKey;
      jsonOutput.imageUrl = fallbackImages[entityType] || fallbackImages['default'];
    }

    // Log the successful image search for debugging
    console.log(`Found image for ${name}: ${imageUrl ? 'Yes' : 'No'}`);

    return NextResponse.json({
      name,
      ...jsonOutput,
    });

  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ error }, { status: 500 });
  }
}