import { INPUT_TEXT_SPLIT_REGEX, TARGET_LOCALE } from './constants/constants.js';
import { ELEMENT_SELECTORS } from './constants/element-selectors.js';
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
  SpecificPhraseTranslator,
];

const clearButtonElement = document.getElementById(ELEMENT_SELECTORS.CLEAR_BUTTON_ID);
const errorMessageElement = document.getElementById(ELEMENT_SELECTORS.ERROR_MESSAGE_ID);
const localeSelectElement = document.getElementById(ELEMENT_SELECTORS.LOCALE_SELECT_ID);
const textInputElement = document.getElementById(ELEMENT_SELECTORS.TEXT_INPUT_ID);
const translateButtonElement = document.getElementById(ELEMENT_SELECTORS.TRANSLATE_BUTTON_ID);
const translatedSentenceElement = document.getElementById(ELEMENT_SELECTORS.TRANSLATED_SENTENCE_ID);

const isEmpty = (text) => {
  return text.trim() === '';
};

const showErrorMessage = () => {
  translatedSentenceElement.innerHTML = '';
  errorMessageElement.innerText = TRANSLATOR_ERROR_MESSAGE;
};

const showTranslationResult = ({ translation, changes }) => {
  translatedSentenceElement.innerHTML = changes
    ? translation
    : TRANSLATOR_NO_TRANSLATION_NEEDED_MESSAGE;
};

const onTranslate = () => {
  const text = textInputElement.value;

  if (isEmpty(text)) {
    showErrorMessage();

    return;
  }

  const targetLocale = localeSelectElement.value;
  const highlightTranslation = (translation) => `<span class="highlight">${translation}</span>`;
  const result = translate(text, targetLocale, highlightTranslation);

  errorMessageElement.innerText = '';
  showTranslationResult(result);
};

const onClear = () => {
  textInputElement.value = '';
  errorMessageElement.innerText = '';
  translatedSentenceElement.innerHTML = '';
};

translateButtonElement.addEventListener('click', onTranslate);
clearButtonElement.addEventListener('click', onClear);

const runTranslationPipeline = (context, locale) => {
  let result;

  for (let translator of TRANSLATION_PIPELINE) {
    result = translator.translate(context, locale);

    if (result) {
      break;
    }
  }

  return result;
};

export const translate = (text, locale = TARGET_LOCALE.GB, transform = (value) => value) => {
  let changes = 0;
  let lastSkippedTranslationIndex = DEFAULT_SKIPPED_TRANSLATION_INDEX;
  const translations = [];
  const words = text.split(INPUT_TEXT_SPLIT_REGEX);

  words.forEach((word, index, wordsArray) => {
    if (index > lastSkippedTranslationIndex) {
      const result = runTranslationPipeline({ word, index, wordsArray }, locale);

      if (!result) {
        translations.push(word);
      } else {
        changes++;
        translations.push(transform(result.translation));
        lastSkippedTranslationIndex = result.lastWordIndex || DEFAULT_SKIPPED_TRANSLATION_INDEX;
      }
    }
  });

  return { changes, translation: translations.join(' ') };
};
