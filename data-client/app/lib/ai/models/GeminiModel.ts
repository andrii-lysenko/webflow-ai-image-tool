import { GoogleGenAI } from "@google/genai";
import { AIModel } from "./AIModel";
import { AIImage } from "@/app/types";

enum Modality {
  TEXT = "text",
  IMAGE = "image",
}

export class GeminiModel implements AIModel {
  private ai: GoogleGenAI;
  private model: string;
  private imageGenerationModel: string =
    "gemini-2.0-flash-preview-image-generation";

  constructor(apiKey: string, model: string) {
    this.ai = new GoogleGenAI({ apiKey });
    this.model = model;
  }

  async generate(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt,
    });

    return response.text || "";
  }

  async generateWithImage(prompt: string, image: AIImage): Promise<any> {
    try {
      const contents = [{ text: prompt }, { inlineData: image }];

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: contents,
      });

      return response.text || "";
    } catch (error) {
      console.error("Error in generateWithImage:", error);
      throw error;
    }
  }

  async generateImageFromImage(
    prompt: string,
    image?: AIImage
  ): Promise<{ text: string; imageData?: string }> {
    try {
      const contents: any = [{ text: prompt }];
      if (image) {
        contents.push({ inlineData: image });
      }

      // Generate content with Gemini's image generation model
      const response = await this.ai.models.generateContent({
        model: this.imageGenerationModel,
        contents: contents,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      let textResponse = "";
      let outputImageData = "";

      // Extract text and image data from response
      if (
        response.candidates &&
        response.candidates[0] &&
        response.candidates[0].content &&
        response.candidates[0].content.parts
      ) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            textResponse += part.text;
          } else if (part.inlineData) {
            outputImageData = part.inlineData.data || "";
          }
        }
      }

      return {
        text: textResponse || "Image processing complete.",
        imageData: outputImageData,
      };
    } catch (error) {
      console.error("Error in generateImageFromImage:", error);
      throw error;
    }
  }
}
