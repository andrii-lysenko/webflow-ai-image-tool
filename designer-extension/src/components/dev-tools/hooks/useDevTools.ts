interface UseDevToolsProps {
  logout: () => void;
}

export function useDevTools({ logout }: UseDevToolsProps) {
  const clearEverything = async () => {
    try {
      // 1. Set the explicit logout flag first
      localStorage.setItem("explicitly_logged_out", "true");

      // 2. Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      const base_url = import.meta.env.VITE_NEXTJS_API_URL;
      const response = await fetch(`${base_url}/api/dev/clear`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to clear database");

      logout();

      console.log("Everything cleared successfully");
      return true;
    } catch (error) {
      console.error("Error clearing everything:", error);
      return false;
    }
  };

  const logStorage = () => {
    // Create objects to store all storage items
    const localStorageItems: Record<string, string> = {};
    const sessionStorageItems: Record<string, string> = {};

    // Get all localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        localStorageItems[key] = localStorage.getItem(key) || "";
      }
    }

    // Get all sessionStorage items
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        sessionStorageItems[key] = sessionStorage.getItem(key) || "";
      }
    }

    // Log with better formatting
    console.group("Storage Contents");
    console.log("Local Storage:", localStorageItems);
    console.log("Session Storage:", sessionStorageItems);
    console.groupEnd();
  };

  return {
    clearSession: clearEverything,
    logStorage,
  };
}
