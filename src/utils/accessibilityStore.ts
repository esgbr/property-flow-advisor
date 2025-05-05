
// A dedicated storage utility for accessibility preferences
// This helps centralize the storage logic and reduce code in the A11yProvider

type AccessibilityPreference = {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
};

const STORAGE_KEY = 'a11y-preferences';
const USER_PREFERENCE_KEYS = {
  motion: 'a11y-preferences-motion-user-set',
  contrast: 'a11y-preferences-contrast-user-set',
  text: 'a11y-preferences-text-user-set',
};

export const getStoredPreferences = (): AccessibilityPreference => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load accessibility preferences', error);
  }
  
  return {
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
  };
};

export const storePreference = (
  key: keyof AccessibilityPreference, 
  value: boolean, 
  isUserSet = true
): void => {
  try {
    const current = getStoredPreferences();
    const updated = { ...current, [key]: value };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Mark this as explicitly set by the user when applicable
    if (isUserSet) {
      switch (key) {
        case 'reduceMotion':
          localStorage.setItem(USER_PREFERENCE_KEYS.motion, 'true');
          break;
        case 'highContrast':
          localStorage.setItem(USER_PREFERENCE_KEYS.contrast, 'true');
          break;
        case 'largeText':
          localStorage.setItem(USER_PREFERENCE_KEYS.text, 'true');
          break;
      }
    }
  } catch (error) {
    console.error(`Failed to save accessibility preference: ${key}`, error);
  }
};

export const storeAllPreferences = (
  preferences: AccessibilityPreference,
  isUserSet = true
): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    
    // Clear user preference markers if we're resetting to defaults
    if (!isUserSet) {
      localStorage.removeItem(USER_PREFERENCE_KEYS.motion);
      localStorage.removeItem(USER_PREFERENCE_KEYS.contrast);
      localStorage.removeItem(USER_PREFERENCE_KEYS.text);
    }
  } catch (error) {
    console.error('Failed to save all accessibility preferences', error);
  }
};

export const getUserPreferenceState = (key: keyof typeof USER_PREFERENCE_KEYS): boolean => {
  return localStorage.getItem(USER_PREFERENCE_KEYS[key]) === 'true';
};

export const clearUserPreferenceState = (key: keyof typeof USER_PREFERENCE_KEYS): void => {
  localStorage.removeItem(USER_PREFERENCE_KEYS[key]);
};
