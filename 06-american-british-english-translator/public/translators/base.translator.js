import { TARGET_LOCALE } from '../constants/constants.js';
import { formatTranslationOutput } from './utils.js';

export const BaseTranslator = (function() {
  function translate(dictionary, key, word, locale) {
    if(locale === TARGET_LOCALE.GB) {
      return dictionary[key] ? {translation: formatTranslationOutput(key, word, dictionary[key])} : null;
    }
  
    const entries = Object.entries(dictionary); 
    const entry = entries.find(([_, britishVersion]) => key === britishVersion);
  
    return entry ? {translation: formatTranslationOutput(key, word, entry[0])} : null;
  }

  return {
    translate
  };
} ());
