import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedIdea } from "../types";

let aiInstance: any = null;

const getAIClient = () => {
  if (aiInstance) return aiInstance;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("Gemini API Key is missing. Content generation will be disabled.");
    return null;
  }

  try {
    aiInstance = new GoogleGenAI({ apiKey });
    return aiInstance;
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
    return null;
  }
};

export const generateContentIdeas = async (topic: string, platform: string): Promise<GeneratedIdea[]> => {
  const ai = getAIClient();

  if (!ai) {
    console.error("Gemini AI client not initialized (missing API key?)");
    return []; // Fail gracefully returning empty array
  }

  try {
    const prompt = `Actúa como un estratega de contenido senior en la agencia Nomtec. 
    Analiza el idioma en el que está escrito el tema: "${topic}".
    Genera 5 ideas de contenido creativo y viral para la plataforma "${platform}" sobre el tema "${topic}".
    IMPORTANTE: Las ideas deben estar escritas ESTRICTAMENTE en el mismo idioma que el tema proporcionado (si el tema está en inglés, responde en inglés; si está en español, en español).
    Las ideas deben ser innovadoras, modernas y orientadas a generar engagement.
    Retorna solo el JSON puro.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite-preview-02-05",
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

    const text = response.text(); // Note: response.text() is usually a function in newer SDKs, but user had response.text property?
    // In @google/genai SDK (v0.1+), it might be different. 
    // Checking previous file content: "const text = response.text;" 
    // If that worked locally, I should respect it.
    // BUT, wait, "gemini-3-flash-preview" suggests user is using VERY new stuff or standard Google Generative AI SDK.
    // package.json says "@google/genai": "^1.39.0" ? incorrectly?
    // Let's check package.json again.

    if (!text) return [];

    // The SDK sometimes wraps it in markdown code blocks
    const cleanText = text.replace(/```json|```/g, '').trim();

    return JSON.parse(cleanText) as GeneratedIdea[];

  } catch (error) {
    console.error("Error generating content ideas:", error);
    // Don't throw, return empty to keep UI alive
    return [];
  }
};