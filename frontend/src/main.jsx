import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from '@material-tailwind/react';

const CLIENT_ID=import.meta.env.VITE_GOOGLE_CLIENT_ID


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <GoogleOAuthProvider  clientId={CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
