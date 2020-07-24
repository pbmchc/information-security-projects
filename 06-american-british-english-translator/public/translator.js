import { TimeTranslator } from './translators/time.translator.js';
import { TitleTranslator } from './translators/title.translator.js';
import { SpellingTranslator } from './translators/spelling.translator.js';
import { SpecificWordTranslator } from './translators/specific-word.translator.js';
import { SpecificPhraseTranslator } from './translators/specific-phrase.translator.js';

const DEFAULT_SKIPPED_TRANSLATION_INDEX = -1;
const TRANSLATORS = [
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
    result = translator.translate(context, targetLocale);

    if(result) {
      break;
    }
  }

  return result;
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
