import { AIImage } from "@/app/types";
import { AIModel } from "../models/AIModel";
import { Agent } from "./Agent";

interface ImageGeneratorResponse {
  text: string;
  imageData?: string; // Base64 encoded image data
}

function getPrompt(query: string) {
  return `
    Keep the image as close to the original as possible and enhance with the following prompt: ${query}
  `;
}

export class ImageEnhancerAgent implements Agent {
  constructor(private model: AIModel) {}

  async respond(
    query: string,
    images?: AIImage[] // array of image URLs or base64 strings
  ): Promise<ImageGeneratorResponse> {
    try {
      if (!images || images.length === 0) {
        return {
          text: "No reference images provided.",
        };
      }

      const image = images?.length
        ? { data: images[0].data, mimeType: images[0].mimeType }
        : undefined;

      const prompt = getPrompt(query);
      const response = await this.model.generateImageFromImage(prompt, image);

      return {
        text: response.text || "Here's your generated image.",
        imageData: response.imageData,
      };
    } catch (error) {
      console.error("Error in ImageGeneratorAgent:", error);

      return {
        text: `There was an error generating your image. ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }
}
