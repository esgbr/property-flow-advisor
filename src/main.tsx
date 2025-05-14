
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './utils/accessibilityStyles.css';
import { detectKeyboardUser } from './lib/utils';

// Initialize keyboard user detection for better focus styles
detectKeyboardUser();

// Initialize the application
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Could not find root element");
}

// Enhanced global error handling for debugging and user experience
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
    
    // Enhanced accessibility
    errorElement.setAttribute('tabindex', '0');
    errorElement.style.outline = '2px solid transparent';
    errorElement.addEventListener('focus', () => {
      errorElement.style.outline = '2px solid white';
    });
    errorElement.addEventListener('blur', () => {
      errorElement.style.outline = '2px solid transparent';
    });
    
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
    
    // Report button for support
    const reportButton = document.createElement('button');
    reportButton.textContent = 'Report Issue';
    reportButton.style.marginLeft = '10px';
    reportButton.style.backgroundColor = 'transparent';
    reportButton.style.color = 'white';
    reportButton.style.padding = '4px 8px';
    reportButton.style.borderRadius = '4px';
    reportButton.style.border = '1px solid white';
    reportButton.style.cursor = 'pointer';
    reportButton.onclick = () => {
      // Open a feedback form or reporting mechanism
      const errorInfo = {
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        errorMessage: event.error?.message || 'Unknown error'
      };
      console.info('Error report data:', errorInfo);
      alert('Error details have been logged for reporting. Thank you!');
    };
    errorElement.appendChild(reportButton);
    
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
      
      // Try to navigate to a safe route if possible
      if (window.location.pathname !== '/') {
        const navEvent = new PopStateEvent('popstate');
        window.dispatchEvent(navEvent);
      }
    } catch (recoveryError) {
      console.error('Failed to recover from error:', recoveryError);
    }
  }
});

// Enhanced keyboard navigation
window.addEventListener('keydown', (event) => {
  // Add global keyboard shortcuts here
  if (event.key === '?' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    console.info('Keyboard shortcuts help triggered');
    
    // Create and show keyboard shortcuts help modal
    const existingModal = document.getElementById('keyboard-shortcuts-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'keyboard-shortcuts-modal';
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.right = '0';
    modalOverlay.style.bottom = '0';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalOverlay.style.zIndex = '9999';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-labelledby', 'shortcuts-title');
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '8px';
    modalContent.style.padding = '24px';
    modalContent.style.width = '500px';
    modalContent.style.maxWidth = '90%';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflowY = 'auto';
    
    const modalTitle = document.createElement('h2');
    modalTitle.id = 'shortcuts-title';
    modalTitle.textContent = 'Keyboard Shortcuts';
    modalTitle.style.marginTop = '0';
    modalTitle.style.marginBottom = '16px';
    modalTitle.style.fontSize = '20px';
    modalTitle.style.fontWeight = 'bold';
    
    const shortcutsList = document.createElement('dl');
    shortcutsList.style.display = 'grid';
    shortcutsList.style.gridTemplateColumns = 'auto 1fr';
    shortcutsList.style.gap = '8px 16px';
    
    const shortcuts = [
      { key: '? (Ctrl + ?)', description: 'Show this help dialog' },
      { key: 'Tab', description: 'Navigate between focusable elements' },
      { key: 'Esc', description: 'Close dialogs or cancel operations' },
      { key: '/ or Ctrl + F', description: 'Focus search field' },
      { key: 'Alt + A', description: 'Open accessibility settings' },
      { key: 'Alt + H', description: 'Go to home page' },
      { key: 'Alt + D', description: 'Go to dashboard' },
      { key: 'Alt + P', description: 'Go to properties' },
      { key: 'Alt + T', description: 'Go to tools' },
      { key: 'Alt + S', description: 'Go to settings' }
    ];
    
    shortcuts.forEach(shortcut => {
      const dt = document.createElement('dt');
      dt.style.fontWeight = 'bold';
      dt.style.padding = '4px 8px';
      dt.style.backgroundColor = '#f1f5f9';
      dt.style.borderRadius = '4px';
      dt.textContent = shortcut.key;
      
      const dd = document.createElement('dd');
      dd.style.margin = '0';
      dd.style.display = 'flex';
      dd.style.alignItems = 'center';
      dd.textContent = shortcut.description;
      
      shortcutsList.appendChild(dt);
      shortcutsList.appendChild(dd);
    });
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '24px';
    closeButton.style.padding = '8px 16px';
    closeButton.style.backgroundColor = '#3b82f6';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => document.body.removeChild(modalOverlay);
    
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(shortcutsList);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Close on escape
    modalOverlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(modalOverlay);
      }
    });
    
    // Close on click outside
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
      }
    });
    
    // Focus the modal
    closeButton.focus();
  }
  
  // Toggle focus order visualization with Alt+F2
  if (event.altKey && event.key === 'F2') {
    event.preventDefault();
    document.body.classList.toggle('show-focus-order');
    console.info('Focus order visualization toggled');
  }
});

// Flag once the dom is fully loaded to prevent issues in iOS Safari
document.addEventListener('DOMContentLoaded', () => {
  document.body.setAttribute('data-loaded', 'true');
});

createRoot(rootElement).render(
  <App />
);
