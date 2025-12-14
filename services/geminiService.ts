import { GoogleGenAI } from "@google/genai";
import { BatteryStats } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const simulateFuture = async (stats: BatteryStats, modelName: string) => {
  const ai = getAiClient();
  if (!ai) throw new Error("API Key missing");

  // This prompt asks Gemini to project the future based on current bad habits (simulated context)
  const prompt = `
    Based on the current BMS data for a ${modelName}, simulate a scenario where the user continues their current usage patterns (assumed to be slightly aggressive or sub-optimal for this simulation).
    
    Current Data:
    - Confidence (SoH): ${stats.confidenceScore}%
    - Temp: ${stats.temp}°C
    - Cycles: ${stats.cycles}
    
    Return a JSON object with:
    1. "futureConfidence": A number representing SoH in 12 months (lower than current).
    2. "replacementCost": Estimated cost in USD to replace the battery earlier than expected.
    3. "consequence": A one-sentence, brutal but helpful explanation of why (e.g., "Frequent fast charging is crystallizing your anode.").
    
    Return ONLY raw JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    return {
      futureConfidence: stats.confidenceScore - 2.5,
      replacementCost: 14000,
      consequence: "Continued thermal stress will irreversibly degrade capacity."
    };
  }
};

export const generateReportCard = async (stats: BatteryStats) => {
  const ai = getAiClient();
  if (!ai) return null;

  const prompt = `
    Generate a battery report card for a user with:
    - SoH: ${stats.confidenceScore}%
    - Cycles: ${stats.cycles}
    
    Return JSON:
    {
      "grade": "A/B/C",
      "behaviorScore": number (0-100),
      "riskOutlook": "Low/Moderate/High",
      "summary": "Short, punchy summary of their week."
    }
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return {
      grade: 'B+',
      behaviorScore: 88,
      riskOutlook: 'Low',
      summary: 'Consistent charging habits are paying off.'
    };
  }
};

export const getMaintenanceActions = async (stats: BatteryStats, modelName: string) => {
  const ai = getAiClient();
  if (!ai) return ["Inspect thermal management system", "Limit fast charging to 80%", "Calibrate BMS overnight"];

  const prompt = `
    Based on battery stats (SoH: ${stats.confidenceScore}%, Temp: ${stats.temp}C) for a ${modelName},
    list 3 short, specific, actionable maintenance recommendations or behavioral changes that the user can do right now to improve health.
    Focus on immediate actions.
    Return pure JSON array of strings. e.g. ["Park in shade immediately", "Limit max charge to 80%"].
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return ["Avoid parking in direct sunlight", "Limit DC fast charging usage", "Keep state of charge between 20-80%"];
  }
};

export const findNearbyServices = async (lat: number, lng: number) => {
  const ai = getAiClient();
  if (!ai) throw new Error("API Key missing");
  
  // Minimalist prompt for high quality locations
  const prompt = `Find the highest rated specialist EV battery service centers near ${lat}, ${lng}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { tools: [{ googleMaps: {} }] },
    });
    return { 
      text: response.text, 
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (error) {
    return { text: "Service unavailable.", chunks: [] };
  }
};