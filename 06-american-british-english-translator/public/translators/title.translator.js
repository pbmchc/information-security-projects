import { AMERICAN_TO_BRITISH_TITLES } from '../translations/american-to-british-titles.js';
import { BaseTranslator } from './base.translator.js';

const TRANSLATOR_NAME = 'TITLES_TRANSLATOR';

export const TitleTranslator = (function() {
  function translate({word}, locale) {
    return BaseTranslator.translate(getTranslatorContext(word, locale));
  }

  function getTranslatorContext(word, locale) {
    return {
      name: TRANSLATOR_NAME,
      dictionary: AMERICAN_TO_BRITISH_TITLES,
      translationKey: word.toLowerCase(),
      word,
      locale
    };
  }

  return {
    translate
  };
} ());
