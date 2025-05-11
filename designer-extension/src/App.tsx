import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, Box } from "@mui/material";

import { Navigation } from "./components/Navigation";
import { AuthScreen } from "./components/AuthScreen";
import { useAuth } from "./hooks/useAuth"; // Manages authentication state and provides login/logout functionality
import { theme } from "./components/theme";
import "./App.css";
import { Chat } from "./components/chat";
import { DevTools } from "./components/dev-tools";

/**
 * App.tsx serves as the main entry point and demonstrates:
 * 1. Authentication flow with Webflow's Designer and Data APIs
 * 2. Data fetching patterns using React Query
 * 3. State management for user sessions
 * 4. Development tools for testing
 */

// This is the main App Component. It handles the initial setup and rendering of the Dashboard.
function AppContent() {
  const { sessionToken, exchangeAndVerifyIdToken, logout } = useAuth();

  // Move ref outside useEffect to persist across renders
  const hasCheckedToken = useRef(false);

  useEffect(() => {
    // Set the extension size to large
    webflow.setExtensionSize("comfortable");

    // Only run auth flow if not already checked
    if (!hasCheckedToken.current) {
      const storedUser = localStorage.getItem("wf_hybrid_user");
      const wasExplicitlyLoggedOut = localStorage.getItem(
        "explicitly_logged_out"
      );

      if (storedUser && !wasExplicitlyLoggedOut) {
        exchangeAndVerifyIdToken();
      }
      hasCheckedToken.current = true;
    }

    // Handle the authentication complete event
    const handleAuthComplete = async (event: MessageEvent) => {
      if (event.data === "authComplete") {
        localStorage.removeItem("explicitly_logged_out");
        await exchangeAndVerifyIdToken();
      }
    };

    // Add the event listener for the authentication complete event
    window.addEventListener("message", handleAuthComplete);
    return () => {
      window.removeEventListener("message", handleAuthComplete);
      // Reset the check on unmount so it can run again if needed
      hasCheckedToken.current = false;
    };
  }, [exchangeAndVerifyIdToken]);

  // Render the app
  return (
    <BrowserRouter>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Navigation />
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Routes>
            <Route
              path="/"
              element={
                // If the user is authenticated, render the dashboard
                sessionToken ? (
                  <Chat sessionToken={sessionToken} mode="enhance" />
                ) : (
                  <AuthScreen onAuth={() => {}} />
                )
              }
            />
            <Route
              path="/generate"
              element={
                sessionToken ? (
                  <Chat sessionToken={sessionToken} mode="generate" />
                ) : (
                  <AuthScreen onAuth={() => {}} />
                )
              }
            />
            <Route path="/custom-code" element={<></>} />
            <Route path="/dev-tools" element={<DevTools logout={logout} />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
