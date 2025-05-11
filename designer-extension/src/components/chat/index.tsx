"use client";

import { useRef, useEffect } from "react";
import { useChat } from "./hooks/useChat";
import { ImageIcon, SendIcon } from "./icons";
import { EmptyStateMessage } from "./empty-message";
import { ImagePreview } from "./image-preview";
import { ChatMessage } from "./message";
import {
  Paper,
  Box,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import { ChatMode } from "./types";

type Props = {
  sessionToken: string;
  mode: ChatMode;
};

export function Chat({ sessionToken, mode }: Props) {
  const {
    messages,
    handleImageSelect,
    removeImage,
    handleSendMessage,
    imagePreviewUrls,
    isLoading,
    input,
    selectedImages,
    setInput,
  } = useChat(sessionToken, mode);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAttachImage = () => {
    fileInputRef.current?.click();
  };

  const isMessageInputEmpty = !input.trim() && selectedImages.length === 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 56px)", // Subtract the height of the AppBar/Toolbar
        maxHeight: "calc(100vh - 56px)",
        bgcolor: "grey.50",
      }}
    >
      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.length === 0 ? (
          <EmptyStateMessage mode={mode} />
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <Box
                sx={{
                  alignSelf: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,
                  mt: 1,
                }}
              >
                <CircularProgress
                  size={36}
                  thickness={4}
                  color="primary"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                  Processing your request...
                </Box>
              </Box>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Image Preview Area */}
      {imagePreviewUrls.length > 0 && (
        <ImagePreview
          imagePreviewUrls={imagePreviewUrls}
          removeImage={removeImage}
        />
      )}

      <Paper
        elevation={0}
        square
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "grey.200",
          bgcolor: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
          {mode === "generate" && (
            <IconButton
              onClick={handleAttachImage}
              color="primary"
              aria-label="Attach image"
              sx={{ p: 1 }}
            >
              <ImageIcon />
            </IconButton>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            multiple
            style={{ display: "none" }}
          />

          <TextField
            fullWidth
            multiline
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              mode === "enhance"
                ? "How would you like to enhance the image?"
                : "What image would you like to generate?"
            }
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: "0.9rem",
              },
            }}
          />

          <IconButton
            onClick={handleSendMessage}
            disabled={isMessageInputEmpty || isLoading}
            color="primary"
            aria-label="Send message"
            sx={{
              p: 1,
              bgcolor:
                isLoading || isMessageInputEmpty ? "grey.300" : "primary.main",
              color: isLoading || isMessageInputEmpty ? "grey.500" : "white",
              borderRadius: "50%",
              "&:hover": {
                bgcolor:
                  isLoading || isMessageInputEmpty
                    ? "grey.300"
                    : "primary.dark",
              },
              "&.Mui-disabled": {
                bgcolor: "grey.300",
                color: "grey.500",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
