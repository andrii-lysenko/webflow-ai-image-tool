export async function enhanceImage(
  sessionToken: string,
  input: string,
  assetId: string
) {
  const response = await fetch(
    `${import.meta.env.VITE_NEXTJS_API_URL}/api/image-ai/enhance`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
        selectedImage: assetId,
      }),
    }
  );
  return response;
}

export async function generateImage(
  sessionToken: string,
  input: string,
  processedImages?: any[]
) {
  const response = await fetch(
    `${import.meta.env.VITE_NEXTJS_API_URL}/api/image-ai/generate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
        images: processedImages,
      }),
    }
  );
  return response;
}
