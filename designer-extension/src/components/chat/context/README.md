# Chat Context System

This directory contains the Context-based state management system for the chat functionality.

## Features

- Separate message history for each chat mode (enhance/generate)
- Centralized state management
- Clean API for components to consume
- Reducer-based state updates for predictable changes

## Usage

Wrap your application with the `ChatProvider` at a high level:

```tsx
<ChatProvider sessionToken={sessionToken}>
  <YourComponents />
</ChatProvider>
```

Then use the hook in your components:

```tsx
import { useChat } from "./hooks/useChat";

function YourComponent() {
  const {
    messages,
    input,
    setInput,
    handleSendMessage,
    // ... other properties and methods
  } = useChat();

  // Access mode-specific messages with messages[mode]
  const enhanceMessages = messages.enhance;
  const generateMessages = messages.generate;

  // Rest of your component...
}
```

## Future Improvements

- Add persistence with localStorage or IndexedDB
- Implement middleware for API calls
- Add more advanced features like message editing or deletion
