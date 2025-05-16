
/**
 * iOS-specific utilities and optimizations
 */

import { Capacitor } from '@capacitor/core';

/**
 * Check if the app is running on iOS
 */
export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

/**
 * Apply iOS-specific styles to an element
 * @param element The DOM element to apply iOS styles to
 */
export const applyIOSStyles = (element: HTMLElement | null): void => {
  if (!element || !isIOS()) return;
  
  // Apply iOS-specific styles
  element.classList.add('ios-device');
  
  // Improve touch targets for iOS
  const interactiveElements = element.querySelectorAll('button, a, input, select, [role="button"]');
  interactiveElements.forEach(el => {
    (el as HTMLElement).classList.add('ios-touch-target');
  });
};

/**
 * Adjust scroll behavior for iOS devices
 * - Addresses iOS momentum scrolling issues
 * - Improves accessibility
 */
export const optimizeIOSScrolling = (): void => {
  if (!isIOS()) return;
  
  // Apply iOS-specific scrolling styles to relevant containers
  const scrollContainers = document.querySelectorAll('.scroll-area, [data-scroll-container]');
  scrollContainers.forEach(container => {
    (container as HTMLElement).classList.add('ios-scroll');
  });
};

/**
 * Initialize iOS-specific optimizations
 */
export const initializeIOSOptimizations = (): void => {
  if (!isIOS()) return;
  
  // Add iOS-specific body class
  document.body.classList.add('ios-device');
  
  // Setup safe area insets for iOS notches and UI elements
  setupSafeAreaInsets();
  
  // Optimize scrolling
  optimizeIOSScrolling();
};

/**
 * Setup safe area insets for iOS devices with notches
 */
const setupSafeAreaInsets = (): void => {
  if (!isIOS()) return;
  
  // Add CSS variables for safe area insets
  const style = document.createElement('style');
  style.innerHTML = `
    :root {
      --sat: env(safe-area-inset-top);
      --sar: env(safe-area-inset-right);
      --sab: env(safe-area-inset-bottom);
      --sal: env(safe-area-inset-left);
    }
    
    .ios-safe-padding-top {
      padding-top: var(--sat, 0);
    }
    
    .ios-safe-padding-bottom {
      padding-bottom: var(--sab, 0);
    }
    
    .ios-safe-margin-bottom {
      margin-bottom: var(--sab, 0);
    }
    
    .ios-touch-target {
      min-height: 44px;
      min-width: 44px;
    }
    
    .ios-scroll {
      -webkit-overflow-scrolling: touch;
    }
  `;
  document.head.appendChild(style);
};

