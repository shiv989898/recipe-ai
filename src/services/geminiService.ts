import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Recipe {
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
}

export async function generateRecipe(dishName: string): Promise<Recipe> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `Generate a detailed recipe for "${dishName}". Include prep time, cook time, servings, a short description, ingredients, and step-by-step instructions.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            prepTime: { type: Type.STRING },
            cookTime: { type: Type.STRING },
            servings: { type: Type.STRING },
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["name", "description", "prepTime", "cookTime", "servings", "ingredients", "instructions"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("The culinary AI returned an empty response. Please try a different dish name.");
    }

    return JSON.parse(text);
  } catch (e: any) {
    console.error("AI Generation Error:", e);
    if (e?.message?.includes("503") || e?.message?.includes("overloaded")) {
      throw new Error("The kitchen is currently overloaded! Please wait a moment and try again.");
    }
    throw new Error("Failed to generate recipe. Please check your spelling or try another dish.");
  }
}
