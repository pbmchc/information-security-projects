import { IGNORED_CHARACTERS_REGEX } from '../constants/constants.js';

export function convertToTranslationKey(word, pattern = IGNORED_CHARACTERS_REGEX) {
  return word.toLowerCase().replace(pattern, '');
}

function getFirstLetterIndex(word) {
  return word.search(/\w/);
}

function isCapitalized(word, firstLetterIndex) {
  return word[firstLetterIndex] === word[firstLetterIndex].toUpperCase();
}

function capitalizeTranslationOutput(output, index) {
  const beginning = output.substring(0, index);
  const ending = output.substring(index + 1);

  return `${beginning}${output[index].toUpperCase()}${ending}`;
}

export function formatTranslationOutput(key, word, translation) {
  if (!translation) {
    return;
  }

  const index = getFirstLetterIndex(word);
  const output = word.toLowerCase().replace(key, translation);

  return isCapitalized(word, index) ? capitalizeTranslationOutput(output, index) : output;
}
