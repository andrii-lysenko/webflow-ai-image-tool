import { NextRequest, NextResponse } from "next/server";
import { getAgent } from "@/app/lib/ai";
import jwt from "@/app/lib/utils/jwt";

export async function POST(request: NextRequest) {
  try {
    const accessToken = await jwt.verifyAuth(request);
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { message, images } = await request.json();

    if (!message) {
      throw new Error(`Message is required`);
    }

    const agent = getAgent("imageGenerator");

    // Process with the agent - pass query and any reference images
    const generatorResponse = await agent.respond(message, images);

    // If we have a generated image, return it to the frontend
    if (generatorResponse.imageData) {
      try {
        // Pass the image data directly to the frontend
        return NextResponse.json({
          response: generatorResponse.text,
          imageData: generatorResponse.imageData,
        });
      } catch (error) {
        console.error("Error processing image data:", error);
        // Return response with error message but still include the AI text response
        return NextResponse.json({
          response: generatorResponse.text,
          error:
            "Failed to process the generated image. " +
            (error instanceof Error ? error.message : String(error)),
        });
      }
    }

    // Return just the text response if no image was generated
    return NextResponse.json({ response: generatorResponse.text });
  } catch (error) {
    console.error("Error processing chat message:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
