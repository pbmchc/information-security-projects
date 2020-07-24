import { TARGET_LOCALE } from '../constants/constants.js';
import { formatTranslationOutput } from './utils.js';

export const BaseTranslator = (function() {
  const entries = {};

  function translate(context) {
    const {name, dictionary, translationKey: key, word, locale} = context;

    if(locale === TARGET_LOCALE.GB) {
      return dictionary[key]
        ? {translation: formatTranslationOutput(key, word, dictionary[key])}
        : null;
    }

    if(!entries[name]) {
      entries[name] = Object.entries(dictionary);
    }
    
    const entry = entries[name].find(([_, britishKey]) => key === britishKey);
  
    return entry
      ? {translation: formatTranslationOutput(key, word, entry[0])}
      : null;
  }

  return {
    translate
  };
} ());
