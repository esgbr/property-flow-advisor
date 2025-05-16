
/**
 * Check if the current device is running iOS
 */
export const isIOS = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  
  const ua = window.navigator.userAgent;
  const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  const webkit = !!ua.match(/WebKit/i);
  
  return iOS && webkit && !ua.match(/CriOS/i);
};

/**
 * Initialize iOS specific optimizations
 */
export const initializeIOSOptimizations = (): void => {
  // Add iOS-specific class to body
  document.body.classList.add('ios-optimized');
  
  // Fix for 100vh issue in iOS Safari
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  // Set the initial vh value
  setVh();
  
  // Update on resize and orientation change
  window.addEventListener('resize', setVh);
  window.addEventListener('orientationchange', setVh);
  
  // Prevent overscroll behavior
  document.body.style.overscrollBehavior = 'none';
};
