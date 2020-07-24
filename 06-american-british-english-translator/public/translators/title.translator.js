import { AMERICAN_TO_BRITISH_TITLES } from '../translations/american-to-british-titles.js';
import { BaseTranslator } from './base.translator.js';

export const TitleTranslator = (function() {
  function translate({word}, locale) {
    return BaseTranslator.translate(AMERICAN_TO_BRITISH_TITLES, word.toLowerCase(), word, locale);
  }

  return {
    translate
  };
} ());
