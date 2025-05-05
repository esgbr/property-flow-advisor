
// This file redirects imports from the original LanguageContext to the fixed version
// to prevent TypeScript errors while maintaining compatibility

import {
  LanguageProvider,
  useLanguage,
  SupportedLanguage,
  LanguageInfo,
  availableLanguages
} from './FixedLanguageContext';

export {
  LanguageProvider,
  useLanguage,
  SupportedLanguage,
  LanguageInfo,
  availableLanguages
};

// Re-export the default export
export { LanguageProvider as default };
