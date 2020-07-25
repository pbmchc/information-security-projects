import { TARGET_LOCALE } from '../constants/constants.js';
import { AMERICAN_ONLY } from '../translations/american-only.js';
import { BRITISH_ONLY } from '../translations/british-only.js';
import { convertToTranslationKey, formatTranslationOutput } from './utils.js';

export const SpecificWordTranslator = (function() {
  function translate({word}, locale) {
    const key = convertToTranslationKey(word);
    const dictionary = locale === TARGET_LOCALE.GB ? AMERICAN_ONLY : BRITISH_ONLY;
    const translation = dictionary[key];
  
    return translation ? {translation: formatTranslationOutput(key, word, translation)} : null;
  }

  return {
    translate
  };
} ());
