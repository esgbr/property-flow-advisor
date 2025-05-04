
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './utils/accessibilityStyles.css';

// Initialize the application
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Could not find root element");
}

// Add global error handling for debugging and user experience
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Prevent default browser error handling
  event.preventDefault();
  
  // Display a user-friendly message if in production
  if (import.meta.env.PROD) {
    const errorElement = document.createElement('div');
    errorElement.style.position = 'fixed';
    errorElement.style.top = '10px';
    errorElement.style.left = '50%';
    errorElement.style.transform = 'translateX(-50%)';
    errorElement.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
    errorElement.style.color = 'white';
    errorElement.style.padding = '12px 20px';
    errorElement.style.borderRadius = '6px';
    errorElement.style.zIndex = '9999';
    errorElement.style.maxWidth = '80%';
    errorElement.style.textAlign = 'center';
    errorElement.textContent = 'An unexpected error occurred. The application will attempt to recover.';
    document.body.appendChild(errorElement);
    
    // Remove after 8 seconds
    setTimeout(() => {
      document.body.removeChild(errorElement);
    }, 8000);
  }
});

createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
