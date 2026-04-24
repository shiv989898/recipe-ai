import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FlavorProfile {
  sweet: number;
  spicy: number;
  sour: number;
  bitter: number;
  umami: number;
}

export interface Recipe {
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  nutrition: Nutrition;
  flavorProfile: FlavorProfile;
}

export async function generateRecipe(dishName: string): Promise<Recipe> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash-latest",
      contents: `Generate a detailed recipe for "${dishName}". Include:
1. Prep time, cook time, servings.
2. Short description.
3. Ingredients list.
4. Step-by-step instructions.
5. Nutrition facts per serving (calories, protein in grams, carbs in grams, fat in grams).
6. Flavor profile (scale 1-10 for Sweet, Spicy, Sour, Bitter, Umami).`,
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
            },
            nutrition: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER }
              },
              required: ["calories", "protein", "carbs", "fat"]
            },
            flavorProfile: {
              type: Type.OBJECT,
              properties: {
                sweet: { type: Type.NUMBER },
                spicy: { type: Type.NUMBER },
                sour: { type: Type.NUMBER },
                bitter: { type: Type.NUMBER },
                umami: { type: Type.NUMBER }
              },
              required: ["sweet", "spicy", "sour", "bitter", "umami"]
            }
          },
          required: ["name", "description", "prepTime", "cookTime", "servings", "ingredients", "instructions", "nutrition", "flavorProfile"]
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
