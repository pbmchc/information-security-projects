import { EMPTY_CELL_PLACEHOLDER, VALID_PUZZLE_LENGTH, VALID_PUZZLE_VALUE_REGEX } from '../constants/constants.js';

const INVALID_PUZZLE_FORMAT_ERROR_MESSAGE = 'Error: Puzzle has invalid format';
const INVALID_PUZZLE_LENGTH_ERROR_MESSAGE = 'Error: Expected puzzle to be 81 characters long.';

export function validatePuzzle(puzzle) {
  if(!hasValidPuzzleLength(puzzle)) {
    return INVALID_PUZZLE_LENGTH_ERROR_MESSAGE;
  }

  if(!hasValidPuzzleFormat(puzzle)) {
    return INVALID_PUZZLE_FORMAT_ERROR_MESSAGE;
  }

  return null;
}

export function isValidPuzzleCharacter(character) {
  if(character === '' || character === EMPTY_CELL_PLACEHOLDER) {
    return true;
  }

  return VALID_PUZZLE_VALUE_REGEX.test(character);
}

function hasValidPuzzleLength(puzzle) {
  return puzzle.length === VALID_PUZZLE_LENGTH;
}

function hasValidPuzzleFormat(puzzle) {
  return puzzle.every(isValidPuzzleCharacter);
}
