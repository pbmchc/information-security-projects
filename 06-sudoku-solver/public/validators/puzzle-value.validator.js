import {
  BOARD_ROW_SIZE,
  EMPTY_CELL_PLACEHOLDER,
  VALID_PUZZLE_CHARACTER_REGEX,
  VALID_PUZZLE_FORMAT_REGEX,
  VALID_PUZZLE_LENGTH,
} from '../constants/constants.js';
import { PuzzleInspector } from '../inspectors/puzzle.inspector.js';
import { getCurrentElementIndex } from '../utils/puzzle.utils.js';

const DUPLICATE_PUZZLE_CHARACTERS_ERROR_MESSAGE = 'Error: Puzzle has some duplicate characters';
const INVALID_PUZZLE_FORMAT_ERROR_MESSAGE = 'Error: Puzzle has invalid format';
const INVALID_PUZZLE_LENGTH_ERROR_MESSAGE = 'Error: Expected puzzle to be 81 characters long.';

export function validatePuzzleStructure(value) {
  if (!hasValidPuzzleLength(value)) {
    return INVALID_PUZZLE_LENGTH_ERROR_MESSAGE;
  }

  if (!hasValidPuzzleFormat(value)) {
    return INVALID_PUZZLE_FORMAT_ERROR_MESSAGE;
  }

  return null;
}

export function validatePuzzleElements(puzzle) {
  for (let row = 0; row < BOARD_ROW_SIZE; row++) {
    for (let column = 0; column < BOARD_ROW_SIZE; column++) {
      if (isDuplicateValue(puzzle, { row, column })) {
        return DUPLICATE_PUZZLE_CHARACTERS_ERROR_MESSAGE;
      }
    }
  }

  return null;
}

export function isValidPuzzleCharacter(character) {
  return VALID_PUZZLE_CHARACTER_REGEX.test(character);
}

function hasValidPuzzleLength(value) {
  return value.length === VALID_PUZZLE_LENGTH;
}

function hasValidPuzzleFormat(value) {
  return VALID_PUZZLE_FORMAT_REGEX.test(value);
}

function isDuplicateValue(puzzle, coordinates) {
  const index = getCurrentElementIndex(coordinates);
  const value = puzzle[index];

  if (value === EMPTY_CELL_PLACEHOLDER) {
    return false;
  }

  return PuzzleInspector.hasDuplicates(puzzle, coordinates, { value, index });
}
