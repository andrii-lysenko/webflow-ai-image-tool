import { useState } from "react";

export const useAcceptImage = () => {
  const [isCreatingAsset, setIsCreatingAsset] = useState(false);

  const createAssetFromImage = async (imageUrl: string): Promise<boolean> => {
    if (!imageUrl) return false;

    try {
      setIsCreatingAsset(true);

      // Fetch image from remote source and build a Blob object
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const fileName = `enhanced-image-${Date.now()}.png`;
      const file = new File([blob], fileName, {
        type: "image/png",
      });

      // Create and upload the asset to webflow
      // Assuming the webflow API is available in the global scope or injected elsewhere
      const webflow = (window as any).webflow;
      const asset = await webflow.createAsset(file);
      console.log("Asset created:", asset);

      const selectedImage = await webflow.getSelectedElement();
      if (!selectedImage || selectedImage.type !== "Image") {
        webflow.notify({
          type: "Error",
          message: "Image is not selected.",
        });
        return false;
      }

      selectedImage.setAsset(asset);

      webflow.notify({
        type: "Success",
        message: "Asset created successfully!",
      });

      return true;
    } catch (error) {
      webflow.notify({
        type: "Error",
        message: "Error creating asset",
      });

      return false;
    } finally {
      setIsCreatingAsset(false);
    }
  };

  return {
    isCreatingAsset,
    createAssetFromImage,
  };
};
