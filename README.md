# Webflow AI Image Tool

A Webflow Hybrid App that enables users to enhance and generate images using AI directly within the Webflow Designer. This application demonstrates:

- Integration with the Webflow Designer Extension API
- Building a backend Data Client for processing AI image operations
- OAuth authentication flow for secure access to Webflow resources
- Real-time image enhancement and generation capabilities

## 🚀 Features

- **Image Enhancement**: Apply AI-powered enhancements to existing images in your Webflow site
- **Image Generation**: Create new AI-generated images based on text prompts
- **Seamless Webflow Integration**: Works directly within the Webflow Designer interface
- **Secure Authentication**: Uses OAuth 2.0 for secure access to Webflow resources

## 🛠️ Getting Started

1. Create a Webflow site if you haven't already at [webflow.com](https://webflow.com)
2. Register your app in [your Workspace](https://developers.webflow.com/v2.0.0/data/docs/register-an-app) with the following redirect URI and required scopes:

   - Redirect URI: `localhost:3000/api/auth/callback`
   - Required scopes:
     - `authorized_user: read`
     - `sites:read` `sites:write`
     - `custom_code:read` `custom_code:write`
     - `assets:read` `assets:write`

3. Clone this repository and install the dependencies:

   ```bash
   npm install
   ```

4. Install the Webflow CLI:

   ```bash
   npm install -g @webflow/cli
   ```

5. Create a `.env` file in the `/data-client` folder (copy from `.env.example`) and add your app credentials:

   ```env
   WEBFLOW_CLIENT_ID=xxx
   WEBFLOW_CLIENT_SECRET=xxx
   DESIGNER_EXTENSION_URI=xxx
   PORT=3000
   OPENAI_API_KEY=xxx  # For AI image processing
   ```

6. Run the application in development mode:

   ```bash
   npm run dev
   ```

7. Navigate to `http://localhost:3000` in your browser to authorize the app with your Webflow workspace.

8. Open your Webflow site, access the Apps panel, and click on your App. Then click "Launch Development App".

9. Authenticate and start using the AI image tools within the Webflow Designer.

## 🧰 Tech Stack

- **Backend (Data Client)**:

  - Next.js for the server-side application
  - Webflow SDK for API integration
  - OpenAI API for AI image processing
  - SQLite for local data storage

- **Frontend (Designer Extension)**:
  - React with React Router for UI and routing
  - Material UI for component styling
  - Vite for fast development and bundling
  - JWT authentication for secure communication

## 📁 Project Structure

```
.
├── data-client/                   # Backend server
│   ├── app/
│   │   ├── api/                   # API endpoints
│   │   │   ├── auth/             # Authentication routes
│   │   │   └── image-ai/         # AI image processing routes
│   │   ├── lib/                  # Server utilities
│   │   └── types/                # TypeScript types
│   ├── db/                       # Database files
│   └── scripts/                  # Development scripts
│
├── designer-extension/            # Frontend app
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── chat/            # Chat interface components
│   │   │   └── dev-tools/       # Developer tools
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API services
│   │   └── types/               # TypeScript types
│   └── webflow.json             # Webflow extension configuration
│
└── package.json                   # Root package for running both apps
```

## 📝 Development Notes

- This app uses SQLite for development data storage
- For production, consider:
  - Implementing proper token refresh
  - Using a more robust database solution
  - Adding comprehensive error handling
  - Setting up proper user sessions
  - Securing sensitive data

## 📚 Additional Resources

- [Webflow Developer Documentation](https://developers.webflow.com/)
- [OAuth 2.0 Implementation Guide](https://developers.webflow.com/v2.0.0/data/docs/oauth)
- [Designer Extension Documentation](https://developers.webflow.com/v2.0.0/designer/docs/getting-started-designer-extensions)

## 📄 License

This project is MIT licensed.
