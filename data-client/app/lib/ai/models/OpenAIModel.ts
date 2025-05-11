import OpenAI, { toFile } from "openai";
import { AIModel } from "./AIModel";
import { AIImage } from "@/app/types";
import { getImageAsBase64 } from "../../utils/image";
export class OpenAIModel implements AIModel {
  private ai: OpenAI;
  private model: string;
  private imageModel: string = "gpt-image-1";

  constructor(apiKey: string, model: string) {
    this.ai = new OpenAI({ apiKey });
    this.model = model;
  }

  async generate(prompt: string): Promise<string> {
    const response = await this.ai.chat.completions.create({
      model: this.model,
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content || "";
  }

  async generateWithImage(
    prompt: string,
    image?: AIImage
  ): Promise<{ text: string; imageData?: string }> {
    try {
      let result;
      if (!image) {
        result = await this.ai.images.generate({
          model: this.imageModel,
          prompt,
        });
      } else {
        const buffer = Buffer.from(image.data, "base64");
        const imageData = await toFile(buffer, null, {
          type: image.mimeType,
        });
        result = await this.ai.images.edit({
          model: this.imageModel,
          image: imageData,
          prompt,
        });
      }

      let imageData;

      if (result?.data[0]?.b64_json) {
        imageData = result.data[0].b64_json;
      } else if (result?.data[0]?.url) {
        imageData = (await getImageAsBase64(result?.data[0]?.url)) || undefined;
      }

      return {
        text: "Here's updated image",
        imageData,
      };
    } catch (error) {
      console.error("Error in generateImageFromImage:", error);
      throw error;
    }
  }
}
