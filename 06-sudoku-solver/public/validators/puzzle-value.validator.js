import { EMPTY_CELL_PLACEHOLDER, VALID_PUZZLE_CHARACTER_REGEX, VALID_PUZZLE_FORMAT_REGEX, VALID_PUZZLE_LENGTH } from '../constants/constants.js';

const INVALID_PUZZLE_FORMAT_ERROR_MESSAGE = 'Error: Puzzle has invalid format';
const INVALID_PUZZLE_LENGTH_ERROR_MESSAGE = 'Error: Expected puzzle to be 81 characters long.';

export function validatePuzzle(value) {
  if(!hasValidPuzzleLength(value)) {
    return INVALID_PUZZLE_LENGTH_ERROR_MESSAGE;
  }

  if(!hasValidPuzzleFormat(value)) {
    return INVALID_PUZZLE_FORMAT_ERROR_MESSAGE;
  }

  return null;
}

export function isValidPuzzleCharacter(character) {
  if(character === '' || character === EMPTY_CELL_PLACEHOLDER) {
    return true;
  }

  return VALID_PUZZLE_CHARACTER_REGEX.test(character);
}

function hasValidPuzzleLength(value) {
  return value.length === VALID_PUZZLE_LENGTH;
}

function hasValidPuzzleFormat(value) {
  return VALID_PUZZLE_FORMAT_REGEX.test(value);
}
