import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useAcceptImage } from "./hooks/useAcceptImage";
import { Message } from "./hooks/useChat";

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const theme = useTheme();
  const { isCreatingAsset, createAssetFromImage } = useAcceptImage();
  const [isDeclined, setIsDeclined] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = async () => {
    if (message.enhancedImageUrl) {
      await createAssetFromImage(message.enhancedImageUrl);
      setIsAccepted(true);
    }
  };

  const handleDecline = () => {
    setIsDeclined(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            mr: 1,
            bgcolor: theme.palette.primary.main,
            alignSelf: "flex-end",
            display: { xs: "none", sm: "flex" },
          }}
        >
          AI
        </Avatar>
      )}

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
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: "0.95rem",
              fontStyle: "italic",
            }}
          >
            Declined
          </Typography>
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

                {/* Accept and Decline buttons - only show if not accepted */}
                {!isAccepted && (
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
                      disabled={isCreatingAsset}
                      sx={{ flex: 1 }}
                    >
                      {isCreatingAsset ? (
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
                      disabled={isCreatingAsset}
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

      {isUser && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            ml: 1,
            bgcolor: theme.palette.secondary.main,
            alignSelf: "flex-end",
            display: { xs: "none", sm: "flex" },
          }}
        >
          You
        </Avatar>
      )}
    </Box>
  );
}
