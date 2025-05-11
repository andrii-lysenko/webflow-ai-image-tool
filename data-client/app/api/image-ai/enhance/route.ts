import { NextRequest, NextResponse } from "next/server";
import { WebflowClient } from "webflow-api";
import { getAgent } from "@/app/lib/ai";
import jwt from "@/app/lib/utils/jwt";
import path from "path";
import {
  getImageAsBase64,
  getMimeType,
  SUPPORTED_EXTENSIONS,
} from "@/app/lib/utils/image";
import { AIImage } from "@/app/types";

export async function POST(request: NextRequest) {
  try {
    const accessToken = await jwt.verifyAuth(request);
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const webflow = new WebflowClient({ accessToken });

    // Parse request body
    const { message, selectedImage } = await request.json();
    const asset = await webflow.assets.get(selectedImage);
    const assetUrl = asset?.hostedUrl || "";

    // Check if the asset URL has a valid/supported extension
    const fileExtension = path.extname(assetUrl).toLowerCase();

    if (!SUPPORTED_EXTENSIONS.includes(fileExtension)) {
      throw new Error(
        `Unsupported extension: ${fileExtension}. Please select a PNG, JPEG, WEBP, HEIC, or HEIF image instead.`
      );
    }

    if (!message) {
      throw new Error(`Message is required`);
    }

    const mainImageBase64 = await getImageAsBase64(assetUrl);
    if (!mainImageBase64) {
      throw new Error(
        `I couldn't process the selected image. Please try with a different image in a supported format.`
      );
    }
    const mimeType = getMimeType(assetUrl);

    const image: AIImage = { data: mainImageBase64, mimeType };

    const agent = getAgent("imageEnhancer");

    // Process the image with the agent - pass query, main image URL, and any supporting images
    const enhancerResponse = await agent.respond(message, [image]);

    // If we have a generated image, upload it to Webflow
    if (enhancerResponse.imageData) {
      try {
        // Pass the image data directly to the frontend
        return NextResponse.json({
          response: enhancerResponse.text,
          imageData: enhancerResponse.imageData,
        });
      } catch (error) {
        console.error("Error processing image data:", error);
        // Return response with error message but still include the AI text response
        return NextResponse.json({
          response: enhancerResponse.text,
          error:
            "Failed to process the enhanced image. " +
            (error instanceof Error ? error.message : String(error)),
        });
      }
    }

    // Return just the text response if no image was generated or upload failed
    return NextResponse.json({ response: enhancerResponse.text });
  } catch (error) {
    console.error("Error processing chat message:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
