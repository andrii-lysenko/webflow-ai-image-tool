import { AIImage } from "@/app/types";

export interface AIModel {
  generate(prompt: string): Promise<string>;
  // generateWithImage(prompt: string, image: AIImage): Promise<any>;
  generateWithImage(
    prompt: string,
    image?: AIImage
  ): Promise<{ text: string; imageData?: string }>;
}
