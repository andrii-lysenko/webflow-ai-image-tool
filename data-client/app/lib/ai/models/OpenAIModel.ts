import OpenAI from "openai";
import { AIModel } from "./AIModel";
import { AIImage } from "@/app/types";
export class OpenAIModel implements AIModel {
  private ai: OpenAI;
  private model: string;
  private visionModel: string = "gpt-4o";

  constructor(apiKey: string, model: string) {
    console.log("apiKey", apiKey);
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

  async generateWithImage(prompt: string, image: AIImage): Promise<any> {
    try {
      const response = await this.ai.chat.completions.create({
        model: this.visionModel,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${image.mimeType};base64,${image.data}`,
                },
              },
            ],
          },
        ],
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error("Error in generateWithImage:", error);
      throw error;
    }
  }

  async generateImageFromImage(
    prompt: string,
    image: AIImage
  ): Promise<{ text: string; imageData?: string }> {
    try {
      // First describe the image and get understanding
      const analysisResponse = await this.generateWithImage(
        `Analyze this image: ${prompt}`,
        image
      );

      // Then generate a new image using DALL-E
      const imageResponse = await this.ai.images.generate({
        model: "dall-e-3",
        prompt: `${prompt}\n\nContext from original image: ${analysisResponse}`,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      });

      return {
        text: analysisResponse,
        imageData: imageResponse.data[0]?.b64_json,
      };
    } catch (error) {
      console.error("Error in generateImageFromImage:", error);

      // Return text-only response if image generation fails
      try {
        const textResponse = await this.generateWithImage(
          `I couldn't generate a new image, but here's my analysis: ${prompt}`,
          image
        );
        return {
          text: textResponse,
        };
      } catch (innerError) {
        console.error("Error in fallback text response:", innerError);
        throw error; // Throw the original error
      }
    }
  }
}
