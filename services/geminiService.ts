
import { GoogleGenAI, Modality, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getMimeType = (base64: string): string => {
    // This is a simple check. For a robust solution, you might need a more
    // sophisticated way to determine the mime type from the file itself before encoding.
    if (base64.startsWith('iVBOR')) return 'image/png';
    if (base64.startsWith('/9j/')) return 'image/jpeg';
    return 'image/png'; // default
}

export const generateReunificationImage = async (adultPhotoBase64: string, childPhotoBase64: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image';
    const prompt = `Take the adult from the first image and the child from the second image. Create a new, photorealistic image where the adult is warmly hugging the child. Both should be looking towards the camera with happy expressions. Place them in a studio setting with a clean, smooth, soft white background and natural, soft lighting. Ensure the interaction looks natural and heartwarming.`;

    const adultPhotoPart: Part = {
      inlineData: {
        data: adultPhotoBase64,
        mimeType: getMimeType(adultPhotoBase64),
      },
    };

    const childPhotoPart: Part = {
      inlineData: {
        data: childPhotoBase64,
        mimeType: getMimeType(childPhotoBase64),
      },
    };

    const textPart: Part = { text: prompt };

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [adultPhotoPart, childPhotoPart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (response.candidates && response.candidates[0].content.parts[0].inlineData) {
        const generatedImagePart = response.candidates[0].content.parts[0];
        if (generatedImagePart && generatedImagePart.inlineData) {
            return generatedImagePart.inlineData.data;
        }
    }
    
    throw new Error('Failed to generate image. The model did not return a valid image.');
  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    throw new Error('Could not generate the image. Please try again later.');
  }
};
