import { AMERICAN_TO_BRITISH_SPELLING } from '../translations/american-to-british-spelling.js';
import { BaseTranslator } from './base.translator.js';
import { convertToTranslationKey } from './utils.js';

export const SpellingTranslator = (function() {
  function translate({word}, locale) {
    return BaseTranslator.translate(AMERICAN_TO_BRITISH_SPELLING, convertToTranslationKey(word), word, locale);
  }

  return {
    translate
  };
} ());
