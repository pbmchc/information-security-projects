import { AMERICAN_TO_BRITISH_SPELLING } from '../translations/american-to-british-spelling.js';
import { BaseTranslator } from './base.translator.js';
import { convertToTranslationKey } from './utils.js';

const TRANSLATOR_NAME = 'SPELLING_TRANSLATOR';

export const SpellingTranslator = (function() {
  function translate({word}, locale) {
    return BaseTranslator.translate(getTranslatorContext(word, locale));
  }

  function getTranslatorContext(word, locale) {
    return {
      name: TRANSLATOR_NAME,
      dictionary: AMERICAN_TO_BRITISH_SPELLING,
      translationKey: convertToTranslationKey(word),
      word,
      locale
    };
  }

  return {
    translate
  };
} ());
