
// This file redirects imports from the original LanguageContext to the fixed version
// to prevent TypeScript errors while maintaining compatibility

import {
  LanguageProvider,
  useLanguage,
  availableLanguages,
  languageDetails
} from './FixedLanguageContext';

// Re-export types from the language.d.ts file
export type { SupportedLanguage, LanguageCode } from '@/types/language';

// Re-export the value exports
export {
  LanguageProvider,
  useLanguage,
  availableLanguages,
  languageDetails
} from './FixedLanguageContext';

// Re-export the default export
export { LanguageProvider as default };
