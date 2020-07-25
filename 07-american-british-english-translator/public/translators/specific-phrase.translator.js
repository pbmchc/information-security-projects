import { TARGET_LOCALE } from '../constants/constants.js';
import { AMERICAN_ONLY } from '../translations/american-only.js';
import { BRITISH_ONLY } from '../translations/british-only.js';
import { convertToTranslationKey, formatTranslationOutput } from './utils.js';

export const SpecificPhraseTranslator = (function() {
  function translate({word, index, wordsArray}, locale) {
    const key = convertToTranslationKey(word);
    const dictionary = locale === TARGET_LOCALE.GB ? AMERICAN_ONLY : BRITISH_ONLY;
    const phrases = Object.entries(dictionary).filter(entry => isOpeningWord(entry, key));
    const longestPhraseLength = getLongestPhraseLength(phrases);
  
    return phrases.length
      ? translateLongestPhrase(word, index, wordsArray, dictionary, longestPhraseLength)
      : null;
  }

  function isOpeningWord([translationKey], key) {
    return translationKey.indexOf(key) === 0;
  }

  function getLongestPhraseLength(phrases) {
    return Math.max(...phrases.map(([phrase]) => phrase.split(' ').length));
  }

  function translateLongestPhrase(currentWord, index, wordsArray, dictionary, longestPhraseLength) {
    let originalPhrase = currentWord;
    let phrase = convertToTranslationKey(currentWord);
    let result = null;
  
    for(let i = index + 1; i < index + longestPhraseLength; i++) {
      const phrasePart = wordsArray[i];
  
      if(!phrasePart) {
        continue;
      }
  
      phrase = `${phrase} ${convertToTranslationKey(phrasePart)}`;
      originalPhrase = `${originalPhrase} ${phrasePart}`;
  
      if(dictionary[phrase]) {
        result = {
          translation: formatTranslationOutput(phrase, originalPhrase, dictionary[phrase]),
          lastWordIndex: i
        };
      }
    }
  
    return result;
  }


  return {
    translate
  };
} ());
