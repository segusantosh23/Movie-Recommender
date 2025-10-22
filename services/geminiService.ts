
import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation } from "../types";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getAIRecommendations = async (prompt: string, likedMovieTitles: string[] = []): Promise<AIRecommendation[]> => {
  try {
    let finalPrompt = `Based on the following request, recommend 5 movies. For each movie, provide the title, the year of release, and a short reason for the recommendation. Request: "${prompt}"`;

    if (likedMovieTitles.length > 0) {
      const likedMoviesString = likedMovieTitles.join(', ');
      finalPrompt = `I am a movie fan who likes the following movies: ${likedMoviesString}. Please act as an expert movie recommender. Based on my tastes and my specific request, recommend 5 other movies I might enjoy. My request is: "${prompt}". For each movie, provide the title, the year of release, and a short reason for the recommendation that connects to my taste or request.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "The title of the movie."
                  },
                  year: {
                    type: Type.INTEGER,
                    description: "The year the movie was released."
                  },
                  reason: {
                    type: Type.STRING,
                    description: "A short reason why this movie is recommended."
                  }
                }
              }
            }
          }
        },
      },
    });

    const jsonString = response.text.trim();
    const parsedResponse = JSON.parse(jsonString);
    return parsedResponse.recommendations || [];
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    throw new Error("Failed to get recommendations from AI. Please try again.");
  }
};
