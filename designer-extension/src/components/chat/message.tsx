import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useAcceptImage } from "./hooks/useAcceptImage";
import { Message } from "./context/chatContext";
import { useChat } from "./hooks/useChat";

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const { createAssetFromImage } = useAcceptImage();
  const { updateMessageImageStatus } = useChat();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    if (message.enhancedImageUrl) {
      setIsProcessing(true);
      try {
        await createAssetFromImage(message.enhancedImageUrl);
        updateMessageImageStatus(message.id, "accepted");
      } catch (error) {
        console.error("Error accepting image:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleDecline = () => {
    updateMessageImageStatus(message.id, "declined");
  };

  // Check if the message has an enhanced image that's pending decision
  const hasPendingImage =
    message.enhancedImageUrl && message.imageStatus === "pending";
  const isAccepted = message.imageStatus === "accepted";
  const isDeclined = message.imageStatus === "declined";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: "80%",
          p: 2,
          borderRadius: 2,
          bgcolor: isUser ? "primary.main" : "grey.200",
          color: isUser ? "white" : "text.primary",
          ...(isUser
            ? { borderBottomRightRadius: 0 }
            : { borderBottomLeftRadius: 0 }),
          position: "relative",
        }}
      >
        {isDeclined ? (
          <>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: "0.95rem",
                fontStyle: "italic",
              }}
            >
              {message.content}
            </Typography>
            {message.enhancedImageUrl && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "error.main",
                  fontStyle: "italic",
                  fontSize: "0.85rem",
                }}
              >
                Image enhancement was declined
              </Typography>
            )}
          </>
        ) : (
          <>
            {message.images && message.images.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
                {message.images.map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      position: "relative",
                      height: 96,
                      width: 96,
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Uploaded image ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}

            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: "0.95rem",
              }}
            >
              {message.content}
            </Typography>

            {message.enhancedImageUrl && (
              <Box sx={{ mt: 2, position: "relative" }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mb: 0.5,
                    fontWeight: "bold",
                    color: isUser ? "primary.light" : "text.secondary",
                  }}
                >
                  Enhanced Image:
                  {isAccepted && (
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        color: "success.main",
                        fontSize: "0.75rem",
                      }}
                    >
                      (Accepted)
                    </Box>
                  )}
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={message.enhancedImageUrl}
                    alt="Enhanced image"
                    style={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "contain",
                    }}
                  />
                </Box>

                {/* Accept and Decline buttons - only show if pending */}
                {hasPendingImage && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                      gap: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleAccept}
                      disabled={isProcessing}
                      sx={{ flex: 1 }}
                    >
                      {isProcessing ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CircularProgress
                            size={16}
                            color="inherit"
                            sx={{ mr: 1 }}
                          />
                          Creating...
                        </Box>
                      ) : (
                        "Accept"
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={handleDecline}
                      disabled={isProcessing}
                      sx={{ flex: 1 }}
                    >
                      Decline
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </>
        )}

        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            textAlign: "right",
            color: isUser ? "primary.light" : "text.secondary",
            opacity: 0.8,
          }}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Paper>
    </Box>
  );
}
