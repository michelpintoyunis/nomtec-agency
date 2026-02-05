import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedIdea } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const generateContentIdeas = async (topic: string, platform: string): Promise<GeneratedIdea[]> => {
  try {
    const prompt = `Actúa como un estratega de contenido senior en la agencia Nomtec. 
    Analiza el idioma en el que está escrito el tema: "${topic}".
    Genera 5 ideas de contenido creativo y viral para la plataforma "${platform}" sobre el tema "${topic}".
    IMPORTANTE: Las ideas deben estar escritas ESTRICTAMENTE en el mismo idioma que el tema proporcionado (si el tema está en inglés, responde en inglés; si está en español, en español).
    Las ideas deben ser innovadoras, modernas y orientadas a generar engagement.
    Retorna solo el JSON puro.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Un título pegadizo para el contenido"
              },
              description: {
                type: Type.STRING,
                description: "Una breve descripción de la idea o guión"
              }
            },
            required: ["title", "description"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    return JSON.parse(text) as GeneratedIdea[];

  } catch (error) {
    console.error("Error generating content ideas:", error);
    throw error;
  }
};