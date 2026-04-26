import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111827',
              color: '#e8edf5',
              border: '1px solid #1f2d45',
              fontFamily: 'DM Sans, sans-serif',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#111827' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#111827' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
