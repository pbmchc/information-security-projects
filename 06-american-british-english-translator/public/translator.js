import { AMERICAN_ONLY } from './american-only.js';
import { BRITISH_ONLY } from './british-only.js';
import { AMERICAN_TO_BRITISH_SPELLING } from './american-to-british-spelling.js';
import { AMERICAN_TO_BRITISH_TITLES } from './american-to-british-titles.js';

const AMERICAN_ENGLISH_TIME_REGEX = /(?:[01]{0,1}\d|2[0123]):(?:[012345]\d)/;
const BRITISH_ENGLISH_TIME_REGEX = /(?:[01]{0,1}\d|2[0123])\.(?:[012345]\d)/;
const IGNORED_CHARACTERS_REGEX = /[^\w-']/g;
const IGNORED_CHARACTERS_TIME_REGEX = /[^\d][^\w]/g;
const DEFAULT_SKIPPED_TRANSLATION_INDEX = -1;
const TARGET_LOCALE = {
  GB: 'american-to-british',
  US: 'british-to-american'
};
const TRANSLATORS = [
  translateTime,
  translateTitle,
  translateSpelling,
  translateSpecificWord,
  translateSpecificPhrase
];

const LOCALE_SELECT_ID = 'locale-select';
const TRANSLATE_BUTTON_ID = 'translate-btn';
const TEXT_INPUT_ID = 'text-input';
const TRANSLATED_SENTENCE_ID = 'translated-sentence';

const localeSelectElement = document.getElementById(LOCALE_SELECT_ID);
const translateButtonElement = document.getElementById(TRANSLATE_BUTTON_ID);
const textInputElement = document.getElementById(TEXT_INPUT_ID);
const translatedSentenceElement = document.getElementById(TRANSLATED_SENTENCE_ID);

const translate = () => {
  let lastSkippedTranslationIndex = DEFAULT_SKIPPED_TRANSLATION_INDEX;
  const translations = [];
  const text = textInputElement.value;
  const words = text.split(' ');

  words.forEach((word, index, wordsArray) => {
    if(index > lastSkippedTranslationIndex) {
      const result = runTranslationPipeline({word, index, wordsArray});
      
      if(!result) {
        translations.push(word);
      } else {
        translations.push(highlightTranslation(result.translation));
        lastSkippedTranslationIndex = result.lastWordIndex || DEFAULT_SKIPPED_TRANSLATION_INDEX;
      }
    }
  });

  displayTranslationResult(translations);
};

translateButtonElement.addEventListener('click', translate);

function runTranslationPipeline(context) {
  let result;
  const targetLocale = localeSelectElement.value;

  for(let translator of TRANSLATORS) {
    result = translator(context, targetLocale);

    if(result) {
      break;
    }
  }

  return result;
}

function translateTime({word}, locale) {
  const convertToBritishTime = locale === TARGET_LOCALE.GB;
  const [character, replacement] = convertToBritishTime ? [':', '.'] : ['.', ':'];
  const timePattern = convertToBritishTime
    ? AMERICAN_ENGLISH_TIME_REGEX
    : BRITISH_ENGLISH_TIME_REGEX;
  
  return timePattern.test(convertToTranslationKey(word, IGNORED_CHARACTERS_TIME_REGEX))
    ? {translation: word.replace(character, replacement)}
    : null;
}

function translateTitle({word}, locale) {
  return translateWord(AMERICAN_TO_BRITISH_TITLES, word.toLowerCase(), word, locale);
}

function translateSpelling({word}, locale) {
  return translateWord(AMERICAN_TO_BRITISH_SPELLING, convertToTranslationKey(word), word, locale);
}

function translateSpecificWord({word}, locale) {
  const key = convertToTranslationKey(word);
  const dictionary = locale === TARGET_LOCALE.GB ? AMERICAN_ONLY : BRITISH_ONLY;
  const translation = dictionary[key];

  return translation ? {translation: formatTranslationOutput(key, word, translation)} : null;
}

function translateSpecificPhrase({word, index, wordsArray}, locale) {
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

function getLongestPhraseLength(phrases) {
  return Math.max(...phrases.map(([phrase]) => phrase.split(' ').length));
}

function translateWord(dictionary, key, word, locale) {
  if(locale === TARGET_LOCALE.GB) {
    return dictionary[key] ? {translation: formatTranslationOutput(key, word, dictionary[key])} : null;
  }

  const entries = Object.entries(dictionary); 
  const entry = entries.find(([_, britishVersion]) => key === britishVersion);

  return entry ? {translation: formatTranslationOutput(key, word, entry[0])} : null;
}

function formatTranslationOutput(key, word, translation) {
  if(!translation) {
    return;
  }

  const output = word.toLowerCase().replace(key, translation);

  return isCapitalized(word)
    ? `${output[0].toUpperCase()}${output.substring(1)}`
    : output;
}

function isCapitalized(word) {
  return word[0] === word[0].toUpperCase();
}

function convertToTranslationKey(word, pattern = IGNORED_CHARACTERS_REGEX) {
  return word.toLowerCase().replace(pattern, '');
}

function highlightTranslation(translation) {
  return `<span class="highlight">${translation}</span>`;
}

function displayTranslationResult(result) {
  translatedSentenceElement.innerHTML = result.join(' ');
}

try {
  module.exports = {
    translate
  }
} catch (e) {}
