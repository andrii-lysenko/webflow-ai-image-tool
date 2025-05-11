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
import { ChatProvider } from "./components/chat/context/ChatContext";

/**
 * Main App component that handles routing and global state
 */
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}

/**
 * Main app content that requires access to the Router context
 * and manages authentication state
 */
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
    <Box className="app-container">
      <Navigation />
      <Box className="content-container">
        <Routes>
          <Route
            path="/"
            element={
              // If the user is authenticated, render the dashboard
              sessionToken ? (
                <ChatProvider sessionToken={sessionToken}>
                  <Chat mode="enhance" />
                </ChatProvider>
              ) : (
                <AuthScreen onAuth={() => {}} />
              )
            }
          />
          <Route
            path="/generate"
            element={
              sessionToken ? (
                <ChatProvider sessionToken={sessionToken}>
                  <Chat mode="generate" />
                </ChatProvider>
              ) : (
                <AuthScreen onAuth={() => {}} />
              )
            }
          />
          {/* Developer tools route */}
          <Route
            path="/dev-tools"
            element={
              sessionToken ? (
                <DevTools logout={logout} />
              ) : (
                <AuthScreen onAuth={() => {}} />
              )
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
