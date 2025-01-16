import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context'; // Import AuthProvider
import './index.css';
import App from './App.tsx';
import { CLIENT_ID, USER_POOL_ID, REGION, REDIRECT_URI } from "./Constants.tsx"

// Cognito OIDC configuration
const cognitoAuthConfig = {
  authority: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`, 
  client_id: CLIENT_ID, // Replace with your Cognito App Client ID
  redirect_uri: REDIRECT_URI, // Replace with your allowed callback URL
  response_type: "code", // Use "code" for Authorization Code Flow
  scope: "email openid phone", // Add required scopes
};

// Create the root and render the app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}> {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>,
);