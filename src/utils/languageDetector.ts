
/**
 * Language detection utility functions
 */

/**
 * Detects the user's browser language
 * @returns ISO language code (e.g., 'en', 'de', 'fr')
 */
export function detectBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'en';

  // Get browser language
  const browserLanguage = navigator.language.toLowerCase();
  
  // Extract primary language code (e.g., 'en-US' -> 'en')
  const primaryLanguage = browserLanguage.split('-')[0];
  
  return primaryLanguage;
}

/**
 * Checks if a language is supported by the application
 * @param language - ISO language code to check
 * @param supportedLanguages - Array of supported language codes
 * @returns boolean indicating if language is supported
 */
export function isLanguageSupported(
  language: string, 
  supportedLanguages: string[]
): boolean {
  return supportedLanguages.includes(language);
}

/**
 * Gets the best matching language from browser preferences
 * @param supportedLanguages - Array of supported language codes
 * @returns The best matching supported language code, or 'en' as fallback
 */
export function getBestMatchLanguage(supportedLanguages: string[]): string {
  if (typeof window === 'undefined') return 'en';
  
  // Try to get languages from navigator
  if (navigator.languages && navigator.languages.length) {
    // Loop through browser's preferred languages
    for (const language of navigator.languages) {
      const primaryLanguage = language.split('-')[0].toLowerCase();
      
      if (isLanguageSupported(primaryLanguage, supportedLanguages)) {
        return primaryLanguage;
      }
    }
  }
  
  // Fallback to single language detection
  const browserLanguage = detectBrowserLanguage();
  if (isLanguageSupported(browserLanguage, supportedLanguages)) {
    return browserLanguage;
  }
  
  // Default fallback
  return 'en';
}

/**
 * Detects language from text sample using basic heuristics
 * This is a simple implementation - for production use a proper NLP library
 * @param text - Sample text to analyze
 * @returns Best guess of language code
 */
export function detectLanguageFromText(text: string): string {
  // Simple word-based heuristics
  const germanWords = ['der', 'die', 'das', 'und', 'ist', 'ich', 'zu', 'sie', 'du'];
  const frenchWords = ['le', 'la', 'les', 'un', 'une', 'je', 'tu', 'nous', 'vous', 'et', 'est'];
  const spanishWords = ['el', 'la', 'los', 'las', 'un', 'una', 'y', 'es', 'yo', 'tu'];
  const italianWords = ['il', 'la', 'i', 'le', 'un', 'una', 'e', 'è', 'io', 'tu'];
  
  const textLowerCase = text.toLowerCase();
  const words = textLowerCase.split(/\s+/);
  
  let languageScores: Record<string, number> = {
    de: 0,
    fr: 0,
    es: 0,
    it: 0,
    en: 0  // Default score
  };
  
  // Count language-specific word occurrences
  words.forEach(word => {
    if (germanWords.includes(word)) languageScores.de++;
    if (frenchWords.includes(word)) languageScores.fr++;
    if (spanishWords.includes(word)) languageScores.es++;
    if (italianWords.includes(word)) languageScores.it++;
  });
  
  // Find language with highest score
  let highestLanguage = 'en';
  let highestScore = 0;
  
  Object.entries(languageScores).forEach(([language, score]) => {
    if (score > highestScore) {
      highestScore = score;
      highestLanguage = language;
    }
  });
  
  // If no clear signal, default to English
  return highestScore > 0 ? highestLanguage : 'en';
}

export default {
  detectBrowserLanguage,
  isLanguageSupported,
  getBestMatchLanguage,
  detectLanguageFromText
};
