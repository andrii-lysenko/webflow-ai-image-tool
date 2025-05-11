import { useState, useCallback, useEffect } from "react";
import { ChatMode } from "../types";

type MessageRole = "user" | "assistant";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  images?: string[]; // URLs for the images
  enhancedImageUrl?: string; // URL for the enhanced image
  enhancedImageData?: string; // Base64 data for the enhanced image
};

function createMessage(
  role: MessageRole,
  content: string,
  images?: string[],
  enhancedImageUrl?: string,
  enhancedImageData?: string
): Message {
  return {
    id: Date.now().toString() + role,
    role,
    content,
    timestamp: new Date(),
    images,
    enhancedImageUrl,
    enhancedImageData,
  };
}

export function useChat(sessionToken: string, mode: ChatMode) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;

      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);

      // Create preview URLs for the images
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    },
    []
  );

  // Remove a selected image
  const removeImage = useCallback(
    (index: number) => {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));

      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(imagePreviewUrls[index]);
      setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    },
    [imagePreviewUrls]
  );

  useEffect(() => {
    return () => {
      // Clean up preview URLs on unmount
      imagePreviewUrls.forEach(URL.revokeObjectURL);
    };
  }, []);

  const makeEnhanceRequest = useCallback(async () => {
    const selectedImage = await webflow.getSelectedElement();
    if (!selectedImage || selectedImage.type !== "Image") {
      throw new Error("Please select an image first.");
    }

    const asset = await selectedImage.getAsset();

    if (!asset) {
      throw new Error("Please select an image first.");
    }

    const response = await fetch(
      `${import.meta.env.VITE_NEXTJS_API_URL}/api/enhance`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          selectedImage: asset.id,
        }),
      }
    );

    return response;
  }, [sessionToken, input]);

  const makeGenerateRequest = useCallback(async () => {
    // Convert File objects to base64 data with MIME type
    const processedImages = await Promise.all(
      selectedImages.map(async (file) => {
        return new Promise<{ data: string; mimeType: string }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            // Remove the data URL prefix to get just the base64 data
            const base64Content = base64data.split(",")[1];
            resolve({
              data: base64Content,
              mimeType: file.type,
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    const response = await fetch(
      `${import.meta.env.VITE_NEXTJS_API_URL}/api/generate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          images: selectedImages.length > 0 ? processedImages : undefined,
        }),
      }
    );

    return response;
  }, [sessionToken, input, selectedImages]);

  // Handle sending a message
  const handleSendMessage = useCallback(async () => {
    if ((!input.trim() && selectedImages.length === 0) || isLoading) return;

    try {
      // Create a new user message
      const userMessage = createMessage(
        "user",
        input,
        imagePreviewUrls.length > 0 ? [...imagePreviewUrls] : undefined
      );

      // Add user message to chat
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setEnhancedImage(null);

      // Call the API route
      const response =
        mode === "enhance"
          ? await makeEnhanceRequest()
          : await makeGenerateRequest();

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();

      if (data.imageData) {
        // Create data URL for the image
        const enhancedImageUrl = `data:image/png;base64,${data.imageData}`;
        setEnhancedImage(enhancedImageUrl);

        await webflow.notify({
          type: "Success",
          message: "AI response with enhanced image received!",
        });
      }

      const aiResponse = createMessage(
        "assistant",
        data.response,
        undefined,
        data.imageData ? `data:image/png;base64,${data.imageData}` : undefined,
        data.imageData
      );

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting response from server:", error);

      // Add error message
      const errorResponse = createMessage(
        "assistant",
        "I'm sorry, I encountered an error while processing your message. Please try again."
      );

      setMessages((prev) => [...prev, errorResponse]);

      await webflow.notify({
        type: "Error",
        message: "Failed to process your request. Please try again.",
      });
    } finally {
      setIsLoading(false);

      // Clear selected images after sending
      setSelectedImages([]);
      setImagePreviewUrls([]);
    }
  }, [
    sessionToken,
    input,
    imagePreviewUrls,
    selectedImages,
    isLoading,
    createMessage,
  ]);

  return {
    messages,
    input,
    setInput,
    handleImageSelect,
    removeImage,
    handleSendMessage,
    imagePreviewUrls,
    selectedImages,
    isLoading,
    enhancedImage,
  };
}
