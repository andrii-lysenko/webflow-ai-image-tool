import {
  AI,
  AI_MODEL,
  GEMINI_API_KEY,
  OPENAI_API_KEY,
} from "../../constants/env";
import { ImageEnhancerAgent } from "./agents/ImageEnhancerAgent";
import { ImageGeneratorAgent } from "./agents/ImageGeneratorAgent";
import { AIModel } from "./models/AIModel";
import { GeminiModel } from "./models/GeminiModel";
import { OpenAIModel } from "./models/OpenAIModel";

function getModelInstance(): () => AIModel {
  let instance: AIModel;
  return () => {
    if (!instance) {
      switch (AI) {
        case "openai":
          instance = new OpenAIModel(OPENAI_API_KEY, AI_MODEL);
          return instance;
        case "gemini":
          instance = new GeminiModel(GEMINI_API_KEY, AI_MODEL);
          return instance;
        default:
          instance = new OpenAIModel(OPENAI_API_KEY, AI_MODEL);
          return instance;
      }
    }
    return instance;
  };
}

export const getModel = getModelInstance();

export type AgentType = "imageEnhancer" | "imageGenerator";

export function getAgent(type: AgentType) {
  switch (type) {
    case "imageEnhancer":
      return new ImageEnhancerAgent(getModel());
    case "imageGenerator":
      return new ImageGeneratorAgent(getModel());
  }

  return new ImageGeneratorAgent(getModel());
}
