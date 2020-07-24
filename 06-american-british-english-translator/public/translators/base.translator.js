import { TARGET_LOCALE } from '../constants/constants.js';
import { formatTranslationOutput } from './utils.js';

export const BaseTranslator = (function() {
  const entries = {};

  function translate(context) {
    const {name, dictionary, translationKey, word, locale} = context;

    if(locale === TARGET_LOCALE.GB) {
      return dictionary[translationKey]
        ? {translation: formatTranslationOutput(translationKey, word, dictionary[key])}
        : null;
    }

    if(!entries[name]) {
      entries[name] = Object.entries(dictionary);
    }
    
    const entry = entries[name].find(([_, britishKey]) => translationKey === britishKey);
  
    return entry
      ? {translation: formatTranslationOutput(translationKey, word, entry[0])}
      : null;
  }

  return {
    translate
  };
} ());
