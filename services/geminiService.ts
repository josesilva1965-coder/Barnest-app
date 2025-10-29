import { GoogleGenAI, Type } from "@google/genai";
import type { OrderItem, MenuItem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface SentimentAnalysisResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  keyTopics: string[];
}

export interface PairingSuggestion {
  itemName: string;
  reason: string;
}

export const analyzeSentiment = async (text: string): Promise<SentimentAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the sentiment of the following customer feedback. Identify the key topics mentioned. Feedback: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              description: "The overall sentiment of the feedback. Must be 'Positive', 'Negative', or 'Neutral'.",
            },
            keyTopics: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "A list of key topics or subjects mentioned in the feedback, like 'service', 'food quality', 'ambiance', etc.",
            },
          },
          required: ["sentiment", "keyTopics"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    // Basic validation
    if (result && typeof result.sentiment === 'string' && Array.isArray(result.keyTopics)) {
        return result as SentimentAnalysisResult;
    } else {
        throw new Error("Invalid JSON structure received from API.");
    }

  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    throw new Error("Failed to analyze feedback. Please check the console for details.");
  }
};

export const getPairingSuggestions = async (
    orderItems: OrderItem[], 
    pairingItem: OrderItem, 
    pairingType: 'Wine' | 'Cocktail' | 'Appetizer',
    allMenuItems: MenuItem[]
): Promise<PairingSuggestion[]> => {
    
    const menuContext = allMenuItems
        .filter(item => item.category === (pairingType === 'Appetizer' ? 'Food' : 'Drink'))
        .map(item => `${item.name} (${item.subCategory})`).join(', ');

    const orderContext = orderItems.map(item => item.name).join(', ');
    const prompt = `
        You are an expert sommelier and chef for a modern bar restaurant.
        A customer has the following items in their order: ${orderContext}.
        They are looking for a ${pairingType} to go with their "${pairingItem.name}".

        From the following list of available items on our menu, suggest exactly three ideal pairings.
        Menu for ${pairingType}s: [${menuContext}]

        For each suggestion, provide the item name and a brief, compelling reason (max 20 words) why it's a great pairing. Do not suggest items already in their order.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    itemName: {
                                        type: Type.STRING,
                                        description: "The name of the suggested menu item."
                                    },
                                    reason: {
                                        type: Type.STRING,
                                        description: "A brief explanation for the pairing suggestion."
                                    }
                                },
                                required: ["itemName", "reason"]
                            }
                        }
                    },
                    required: ["suggestions"]
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result && Array.isArray(result.suggestions)) {
            return result.suggestions as PairingSuggestion[];
        } else {
            throw new Error("Invalid JSON structure for pairings received from API.");
        }

    } catch (error) {
        console.error("Error getting pairing suggestions:", error);
        throw new Error("Failed to get AI pairing suggestions.");
    }
};