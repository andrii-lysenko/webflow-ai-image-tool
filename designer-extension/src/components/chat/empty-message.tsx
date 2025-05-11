import { Box, Typography } from "@mui/material";
import { ChatIcon } from "./icons";

export function EmptyStateMessage() {
  const title = "AI Image enhancer";
  const description =
    "Select an image on your page, then describe how you'd like to enhance it.";
  return (
    <Box>
      <Box>
        <ChatIcon />
      </Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" align="center" sx={{ mb: 2 }}>
        {description}
        <br />
        <span
          style={{
            fontSize: "0.85em",
            color: "#666",
            display: "block",
            marginTop: "6px",
          }}
        >
          Supported formats: PNG, JPEG, WEBP, HEIC, HEIF
        </span>
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 1, fontWeight: "bold" }}
        >
          Examples:
        </Typography>
        <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
          "Make this image more vibrant and colorful"
        </Typography>
        <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
          "Add a subtle bokeh effect to the background"
        </Typography>
      </Box>
    </Box>
  );
}
