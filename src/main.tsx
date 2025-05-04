
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
    const existingError = document.getElementById('global-error-message');
    if (existingError) {
      existingError.remove(); // Remove existing error message to prevent stacking
    }
    
    const errorElement = document.createElement('div');
    errorElement.id = 'global-error-message';
    errorElement.role = 'alert';
    errorElement.setAttribute('aria-live', 'assertive');
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
    errorElement.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    errorElement.textContent = 'An unexpected error occurred. The application will attempt to recover.';
    document.body.appendChild(errorElement);
    
    // Add retry button
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Reload';
    retryButton.style.marginLeft = '10px';
    retryButton.style.backgroundColor = 'white';
    retryButton.style.color = 'rgba(220, 38, 38, 0.9)';
    retryButton.style.padding = '4px 8px';
    retryButton.style.borderRadius = '4px';
    retryButton.style.border = 'none';
    retryButton.style.cursor = 'pointer';
    retryButton.onclick = () => window.location.reload();
    errorElement.appendChild(retryButton);
    
    // Remove after 15 seconds
    setTimeout(() => {
      if (document.body.contains(errorElement)) {
        document.body.removeChild(errorElement);
      }
    }, 15000);
    
    // Try to recover the application
    try {
      // Force a re-render
      const appRoot = document.getElementById('root');
      if (appRoot && appRoot.firstChild) {
        const firstChild = appRoot.firstChild;
        appRoot.removeChild(firstChild);
        appRoot.appendChild(firstChild);
      }
    } catch (recoveryError) {
      console.error('Failed to recover from error:', recoveryError);
    }
  }
});

// Enhance keyboard navigation
window.addEventListener('keydown', (event) => {
  // Add global keyboard shortcuts here
  if (event.key === '?' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    console.info('Keyboard shortcuts help triggered');
    // Could show a help modal in the future
  }
});

createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
