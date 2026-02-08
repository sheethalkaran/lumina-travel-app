
import { GoogleGenAI, Type } from "@google/genai";
import { Destination, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function callGemini(fn: () => Promise<any>): Promise<any> {
  try {
    return await fn();
  } catch (error: any) {
    if (error?.status === 429) throw new Error("QUOTA_EXHAUSTED");
    throw error;
  }
}

export const getTravelSuggestions = async (
  location: string, 
  category: 'places' | 'food', 
  excludeNames: string[] = []
): Promise<Destination[]> => {
  const isFood = category === 'food';
  const prompt = isFood 
    ? `List 6 foods for ${location}. JSON: {name, description(10 words), placeType}.`
    : `List 6 landmarks for ${location}. JSON: {name, description(20 words), popularReason, rating, tags}.`;

  const exclusion = excludeNames.length ? ` Exclude: ${excludeNames.join(',')}.` : "";

  try {
    const response = await callGemini(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt + exclusion,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              placeType: { type: Type.STRING },
              popularReason: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "description"]
          }
        }
      }
    }));

    const data = JSON.parse(response.text || "[]");
    return data.map((item: any) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      location,
      description: item.description || "",
      popularReason: item.popularReason || item.description || "A local favorite.",
      rating: item.rating || 4.8,
      tags: item.tags || ["Discovery"],
      placeType: item.placeType || (isFood ? "Local Venue" : "Landmark")
    }));
  } catch (e: any) {
    throw e;
  }
};

/**
 * Chat with the assistant using Google Search grounding.
 * Converts internal ChatMessage role to Gemini compatible 'user'/'model' roles.
 */
export const chatWithAssistant = async (message: string, history: ChatMessage[]) => {
  try {
    const contents = [
      ...history.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await callGemini(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are Lumina, a world-class travel concierge. Provide helpful, concise, and elegant travel advice. Use your grounding sources to provide accurate information and URLs for any places or services mentioned."
      }
    }));

    // Extract grounding source URLs if present
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter(chunk => chunk.web)
      ?.map(chunk => ({
        uri: chunk.web!.uri,
        title: chunk.web!.title || 'Source'
      })) || [];

    return {
      text: response.text || "I apologize, I am unable to process that request right now.",
      sources: sources.length > 0 ? sources : undefined
    };
  } catch (e: any) {
    throw e;
  }
};
