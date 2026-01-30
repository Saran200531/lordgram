
import { GoogleGenAI, Type } from "@google/genai";

// Always use the env var directly.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function suggestMeetupIdeas(postCaption: string, contentType: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this post caption: "${postCaption}" (which is a ${contentType}), suggest 3 fun, creative, and specific real-world meetup ideas for friends. Keep them short and catchy.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              suggestedLocation: { type: Type.STRING }
            },
            required: ["title", "description", "suggestedLocation"]
          }
        }
      }
    });

    // Extract text and handle potential undefined value before parsing.
    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating meetup ideas:", error);
    return [
      { title: "Coffee Hangout", description: "Let's grab a coffee and catch up!", suggestedLocation: "Local Cafe" },
      { title: "Walk in the Park", description: "Fresh air and good conversation.", suggestedLocation: "Central Park" },
      { title: "Dinner Night", description: "Try that new place we talked about.", suggestedLocation: "Downtown Bistro" }
    ];
  }
}

export async function generateCaption(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, authentic, and engaging social media caption for a photo with this description: "${prompt}". No hashtags, just friendly vibes.`,
    });
    // Access the .text property safely and trim whitespace.
    return (response.text || "").trim();
  } catch (error) {
    console.error("Error generating caption:", error);
    return "Great times with great people!";
  }
}

export async function generateMagicReply(lastMessage: string, context: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: You are chatting with a friend. They just said: "${lastMessage}". Conversation history/context: "${context}". Suggest 3 short, friendly, and natural-sounding replies.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    // Access the .text property safely and handle potential undefined value before parsing.
    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating magic reply:", error);
    return ["That sounds awesome!", "Count me in!", "Tell me more!"];
  }
}
