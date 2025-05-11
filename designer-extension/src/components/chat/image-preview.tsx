import { Box, IconButton } from "@mui/material";

type ImagePreviewProps = {
  imagePreviewUrls: string[];
  removeImage: (index: number) => void;
};

export function ImagePreview({
  imagePreviewUrls,
  removeImage,
}: ImagePreviewProps) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderTop: 1,
        borderColor: "grey.200",
        bgcolor: "grey.50",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          pb: 1,
          pt: 1,
          pr: 1,
        }}
      >
        {imagePreviewUrls.map((url, idx) => (
          <Box
            key={idx}
            sx={{
              position: "relative",
              height: 64,
              width: 64,
              flexShrink: 0,
            }}
          >
            <img
              src={url}
              alt={`Preview ${idx + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
            <IconButton
              onClick={() => removeImage(idx)}
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: "error.main",
                color: "white",
                p: 0,
                width: 20,
                height: 20,
                minWidth: 20,
                fontSize: "0.75rem",
                "&:hover": {
                  bgcolor: "error.dark",
                },
              }}
              aria-label="Remove image"
            >
              ×
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
