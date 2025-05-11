import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

export function Loading() {
  return (
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
  );
}
