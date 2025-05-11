import path from "path";

export const SUPPORTED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
];

export const SUPPORTED_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".heic",
  ".heif",
];

// Helper to get MIME type from URL
export function getMimeType(url: string): string {
  const extension = path.extname(url).toLowerCase();
  switch (extension) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".heic":
      return "image/heic";
    case ".heif":
      return "image/heif";
    default:
      return "image/jpeg"; // Default to JPEG
  }
}

// Helper to check if the image format is supported
export function isFormatSupported(mimeType: string): boolean {
  return SUPPORTED_MIME_TYPES.includes(mimeType);
}

// Helper to fetch and convert image to base64
export async function getImageAsBase64(url: string): Promise<string | null> {
  try {
    // Check if the format is supported first
    const mimeType = getMimeType(url);
    if (!isFormatSupported(mimeType)) {
      return null;
    }

    // Get image data
    const response = await fetch(url);
    const imageArrayBuffer = await response.arrayBuffer();
    return Buffer.from(imageArrayBuffer).toString("base64");
  } catch (error) {
    return null;
  }
}
