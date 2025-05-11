import { Box, Typography } from "@mui/material";
import { ChatIcon } from "./icons";
import { ChatMode } from "./types";

type EmptyStateMessageProps = {
  mode: ChatMode;
};

export function EmptyStateMessage({ mode }: EmptyStateMessageProps) {
  const title = mode === "enhance" ? "Enhance your image" : "Generate an image";

  const description =
    mode === "enhance"
      ? "Select an image on your page, then describe how you'd like to transform it."
      : "Describe the image you'd like to generate. You can also provide a reference image.";

  const supportedFormats = "PNG, JPEG, WEBP, HEIC, HEIF";

  const examples =
    mode === "enhance"
      ? [
          "Make this image more vibrant and colorful",
          "Add a subtle bokeh effect to the background",
        ]
      : [
          "A sunset over a tropical beach with palm trees",
          "A futuristic cityscape with flying cars",
        ];

  return (
    <Box sx={{ pt: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <ChatIcon style={{ marginRight: 8, fontSize: "1.5rem" }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        align="center"
        sx={{ mb: 2, fontSize: "0.9rem" }}
      >
        {description}
        <span
          style={{
            fontSize: "0.6rem",
            color: "#666",
            display: "block",
            marginTop: "10px",
          }}
        >
          Supported formats: {supportedFormats}
        </span>
      </Typography>
      <Box
        sx={{
          width: "90%",
          bgcolor: "rgba(0,0,0,0.03)",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            display: "block",
            mb: 1.5,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Try these examples:
        </Typography>

        {examples.map((example, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              display: "block",
              mb: 1,
              color: "primary.main",
              textAlign: "center",
            }}
          >
            {example}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
