import { INPUT_TEXT_SPLIT_REGEX, TARGET_LOCALE } from './constants/constants.js';
import { TimeTranslator } from './translators/time.translator.js';
import { TitleTranslator } from './translators/title.translator.js';
import { SpellingTranslator } from './translators/spelling.translator.js';
import { SpecificWordTranslator } from './translators/specific-word.translator.js';
import { SpecificPhraseTranslator } from './translators/specific-phrase.translator.js';

const DEFAULT_SKIPPED_TRANSLATION_INDEX = -1;
const TRANSLATOR_ERROR_MESSAGE = 'Error: No text to translate.';
const TRANSLATOR_NO_TRANSLATION_NEEDED_MESSAGE = 'Everything looks good to me!';
const TRANSLATION_PIPELINE = [
  TimeTranslator,
  TitleTranslator,
  SpellingTranslator,
  SpecificWordTranslator,
  SpecificPhraseTranslator
];

const CLEAR_BUTTON_ID = 'clear-btn';
const ERROR_MESSAGE_ID = 'error-msg';
const LOCALE_SELECT_ID = 'locale-select';
const TRANSLATE_BUTTON_ID = 'translate-btn';
const TEXT_INPUT_ID = 'text-input';
const TRANSLATED_SENTENCE_ID = 'translated-sentence';

const clearButtonElement = document.getElementById(CLEAR_BUTTON_ID);
const errorMessageElement = document.getElementById(ERROR_MESSAGE_ID);
const localeSelectElement = document.getElementById(LOCALE_SELECT_ID);
const translateButtonElement = document.getElementById(TRANSLATE_BUTTON_ID);
const textInputElement = document.getElementById(TEXT_INPUT_ID);
const translatedSentenceElement = document.getElementById(TRANSLATED_SENTENCE_ID);

const onTranslate = () => {
  const text = textInputElement.value;
  
  if(isEmpty(text)) {
    displayErrorMessage();
    
    return;
  }
  
  const targetLocale = localeSelectElement.value;
  const highlightTranslation = (translation) => `<span class="highlight">${translation}</span>`;
  const result = translate(text, targetLocale, highlightTranslation);

  errorMessageElement.innerText = '';
  displayTranslationResult(result);
};

const onClear = () => {
  textInputElement.value = '';
  errorMessageElement.innerText = '';
  translatedSentenceElement.innerHTML = '';
};

const translate = (text, locale = TARGET_LOCALE.GB, transform = (value) => value) => {
  let changes = 0;
  let lastSkippedTranslationIndex = DEFAULT_SKIPPED_TRANSLATION_INDEX;
  const translations = [];
  const words = text.split(INPUT_TEXT_SPLIT_REGEX);

  words.forEach((word, index, wordsArray) => {
    if(index > lastSkippedTranslationIndex) {
      const result = runTranslationPipeline({word, index, wordsArray}, locale);
      
      if(!result) {
        translations.push(word);
      } else {
        changes++;
        translations.push(transform(result.translation));
        lastSkippedTranslationIndex = result.lastWordIndex || DEFAULT_SKIPPED_TRANSLATION_INDEX;
      }
    }
  });

  return {
    translation: translations.join(' '),
    changes
  };
};

translateButtonElement.addEventListener('click', onTranslate);
clearButtonElement.addEventListener('click', onClear);

function runTranslationPipeline(context, locale) {
  let result;

  for(let translator of TRANSLATION_PIPELINE) {
    result = translator.translate(context, locale);

    if(result) {
      break;
    }
  }

  return result;
}

function displayErrorMessage() {
  translatedSentenceElement.innerHTML = '';
  errorMessageElement.innerText = TRANSLATOR_ERROR_MESSAGE;
}

function displayTranslationResult({translation, changes}) {
  translatedSentenceElement.innerHTML = changes ? translation : TRANSLATOR_NO_TRANSLATION_NEEDED_MESSAGE;
}


function isEmpty(text) {
  return !text.trim();
}

try {
  module.exports = {
    translate
  }
} catch (e) {}
