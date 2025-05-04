
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Initialize the application
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Could not find root element");
}

// Add global error handling for debugging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
