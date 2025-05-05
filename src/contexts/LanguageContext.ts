
// This file redirects imports from the original LanguageContext to the fixed version
// to prevent TypeScript errors while maintaining compatibility

import {
  LanguageProvider,
  useLanguage
} from './FixedLanguageContext';

// Re-export the value exports
export {
  LanguageProvider,
  useLanguage,
  availableLanguages
} from './FixedLanguageContext';

// Re-export the type exports with 'export type'
export type { SupportedLanguage, LanguageInfo } from './FixedLanguageContext';

// Re-export the default export
export { LanguageProvider as default };
