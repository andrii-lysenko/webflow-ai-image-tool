import { AIImage } from "@/app/types";
import { getMimeType, getImageAsBase64 } from "../../utils/image";
import { AIModel } from "../models/AIModel";
import { Agent } from "./Agent";

interface ImageGeneratorResponse {
  text: string;
  imageData?: string; // Base64 encoded image data
}

export class ImageGeneratorAgent implements Agent {
  constructor(private model: AIModel) {}

  async respond(
    query: string,
    images?: AIImage[] // array of image URLs or base64 strings
  ): Promise<ImageGeneratorResponse> {
    try {
      const image = images?.length
        ? { data: images[0].data, mimeType: images[0].mimeType }
        : undefined;

      // Use the AIModel implementation to generate image based on text and reference image
      const response = await this.model.generateImageFromImage(query, image);

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
