import {
  AMERICAN_ENGLISH_TIME_REGEX,
  BRITISH_ENGLISH_TIME_REGEX,
  TARGET_LOCALE,
} from '../constants/constants.js';
import { convertToTranslationKey } from './utils.js';

const IGNORED_CHARACTERS_TIME_REGEX = /[^\d][^\w]/g;

export const TimeTranslator = (function () {
  function translate({ word }, locale) {
    const convertToBritishTime = locale === TARGET_LOCALE.GB;
    const [character, replacement] = convertToBritishTime ? [':', '.'] : ['.', ':'];
    const timePattern = convertToBritishTime
      ? AMERICAN_ENGLISH_TIME_REGEX
      : BRITISH_ENGLISH_TIME_REGEX;

    return timePattern.test(convertToTranslationKey(word, IGNORED_CHARACTERS_TIME_REGEX))
      ? { translation: word.replace(character, replacement) }
      : null;
  }

  return { translate };
})();
