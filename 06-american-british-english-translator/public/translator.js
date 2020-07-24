import { INPUT_TEXT_SPLIT_REGEX } from './constants/constants.js';
import { TimeTranslator } from './translators/time.translator.js';
import { TitleTranslator } from './translators/title.translator.js';
import { SpellingTranslator } from './translators/spelling.translator.js';
import { SpecificWordTranslator } from './translators/specific-word.translator.js';
import { SpecificPhraseTranslator } from './translators/specific-phrase.translator.js';

const DEFAULT_SKIPPED_TRANSLATION_INDEX = -1;
const TRANSLATION_PIPELINE = [
  TimeTranslator,
  TitleTranslator,
  SpellingTranslator,
  SpecificWordTranslator,
  SpecificPhraseTranslator
];

const LOCALE_SELECT_ID = 'locale-select';
const TRANSLATE_BUTTON_ID = 'translate-btn';
const TEXT_INPUT_ID = 'text-input';
const TRANSLATED_SENTENCE_ID = 'translated-sentence';

const localeSelectElement = document.getElementById(LOCALE_SELECT_ID);
const translateButtonElement = document.getElementById(TRANSLATE_BUTTON_ID);
const textInputElement = document.getElementById(TEXT_INPUT_ID);
const translatedSentenceElement = document.getElementById(TRANSLATED_SENTENCE_ID);

const onTranslate = () => {
  const text = textInputElement.value;
  const highlightTranslation = (translation) => `<span class="highlight">${translation}</span>`;
  const translationResult = translate(text, highlightTranslation);

  displayTranslationResult(translationResult);
};

const translate = (text, transform = (value) => value) => {
  let lastSkippedTranslationIndex = DEFAULT_SKIPPED_TRANSLATION_INDEX;
  const translations = [];
  const words = text.split(INPUT_TEXT_SPLIT_REGEX);

  words.forEach((word, index, wordsArray) => {
    if(index > lastSkippedTranslationIndex) {
      const result = runTranslationPipeline({word, index, wordsArray});
      
      if(!result) {
        translations.push(word);
      } else {
        translations.push(transform(result.translation));
        lastSkippedTranslationIndex = result.lastWordIndex || DEFAULT_SKIPPED_TRANSLATION_INDEX;
      }
    }
  });

  return translations.join(' ');
};

translateButtonElement.addEventListener('click', onTranslate);

function runTranslationPipeline(context) {
  let result;
  const targetLocale = localeSelectElement.value;

  for(let translator of TRANSLATION_PIPELINE) {
    result = translator.translate(context, targetLocale);

    if(result) {
      break;
    }
  }

  return result;
}

function displayTranslationResult(result) {
  translatedSentenceElement.innerHTML = result;
}

try {
  module.exports = {
    translate
  }
} catch (e) {}
