import { IGNORED_CHARACTERS_REGEX } from '../constants/constants.js';

export function convertToTranslationKey(word, pattern = IGNORED_CHARACTERS_REGEX) {
  return word.toLowerCase().replace(pattern, '');
}

export function formatTranslationOutput(key, word, translation) {
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