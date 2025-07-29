import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>
    </BrowserRouter>,
)
