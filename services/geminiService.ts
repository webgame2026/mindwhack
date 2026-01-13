
import { GoogleGenAI, Type } from "@google/genai";
import { LevelLogic } from "../types";

// Use process.env.API_KEY exclusively as per guidelines
const createAIInstance = () => {
  if (!process.env.API_KEY) {
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateLevelLogic = async (prompt: string, currentLogic?: LevelLogic): Promise<LevelLogic> => {
  const ai = createAIInstance();
  
  if (!ai) {
    return {
      spawnInterval: 1000,
      activeDuration: 800,
      winConditionScore: 15,
      timeLimit: 30,
      description: "Default logic (API Key Missing)",
      targetWeights: { dog: 30, cat: 20, rat: 30, bonus: 10, hazard: 10 },
      targetScores: { dog: 2, cat: -5, rat: 1, bonus: 10, hazard: -10 },
      speedMultiplier: 1.0,
      targetSizeMultiplier: 1.0,
      moodProfile: 'Classic'
    };
  }

  try {
    const context = currentLogic 
      ? `Current logic state: ${JSON.stringify(currentLogic)}. Adjust it based on this request: "${prompt}"`
      : `Generate a new game balancing logic based on this theme: "${prompt}"`;

    // Use gemini-3-pro-preview for complex reasoning and balancing tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `${context}. 
      Return JSON with spawnInterval, activeDuration, winConditionScore, timeLimit, description, targetWeights, targetScores, speedMultiplier, targetSizeMultiplier, moodProfile.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            spawnInterval: { type: Type.NUMBER },
            activeDuration: { type: Type.NUMBER },
            winConditionScore: { type: Type.INTEGER },
            timeLimit: { type: Type.INTEGER },
            description: { type: Type.STRING },
            speedMultiplier: { type: Type.NUMBER },
            targetSizeMultiplier: { type: Type.NUMBER },
            moodProfile: { type: Type.STRING },
            targetWeights: {
              type: Type.OBJECT,
              properties: {
                dog: { type: Type.NUMBER },
                cat: { type: Type.NUMBER },
                rat: { type: Type.NUMBER },
                bonus: { type: Type.NUMBER },
                hazard: { type: Type.NUMBER }
              },
              required: ["dog", "cat", "rat", "bonus", "hazard"]
            },
            targetScores: {
              type: Type.OBJECT,
              properties: {
                dog: { type: Type.NUMBER },
                cat: { type: Type.NUMBER },
                rat: { type: Type.NUMBER },
                bonus: { type: Type.NUMBER },
                hazard: { type: Type.NUMBER }
              },
              required: ["dog", "cat", "rat", "bonus", "hazard"]
            }
          },
          required: ["spawnInterval", "activeDuration", "winConditionScore", "timeLimit", "description", "targetWeights", "targetScores", "speedMultiplier", "targetSizeMultiplier", "moodProfile"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as LevelLogic;
  } catch (error) {
    console.error("Gemini logic generation failed:", error);
    return {
      spawnInterval: 1000,
      activeDuration: 800,
      winConditionScore: 15,
      timeLimit: 30,
      description: "Default fallback logic.",
      targetWeights: { dog: 30, cat: 20, rat: 30, bonus: 10, hazard: 10 },
      targetScores: { dog: 2, cat: -5, rat: 1, bonus: 10, hazard: -10 },
      speedMultiplier: 1.0,
      targetSizeMultiplier: 1.0,
      moodProfile: 'Classic'
    };
  }
};

export const suggestThemes = async (input?: string): Promise<string[]> => {
  const ai = createAIInstance();
  if (!ai) return ["Cyber City", "Magical Forest", "Deep Space", "Candy Land"];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: input 
        ? `Based on "${input}", suggest 4 creative themes for a whack-a-target game level. Return as a JSON array of strings.`
        : `Suggest 4 trending themes for a whack-a-target game level. Return as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return ["Cyber City", "Magical Forest", "Deep Space", "Candy Land"];
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Gemini theme suggestion failed:", error);
    return ["Cyber City", "Magical Forest", "Deep Space", "Candy Land"];
  }
};
