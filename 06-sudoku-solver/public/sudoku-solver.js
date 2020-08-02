import { EMPTY_CELL_PLACEHOLDER, VALID_PUZZLE_LENGTH } from './constants/constants.js';
import { ELEMENT_SELECTORS } from './constants/element-selectors.js';
import { puzzlesAndSolutions } from './puzzles/puzzle-strings.js';
import { isValidPuzzleCharacter, validatePuzzle } from './validators/puzzle-value.validator.js';

const BOARD_INITIAL_CHARACTER_CODE = 65;
const SAMPLE_PUZZLE = puzzlesAndSolutions[0][0];

const clearButtonElement = document.getElementById(ELEMENT_SELECTORS.CLEAR_BUTTON_ID);
const errorMessageElement = document.getElementById(ELEMENT_SELECTORS.ERROR_MESSAGE_ID);
const puzzleInputElement = document.getElementById(ELEMENT_SELECTORS.SUDOKU_INPUT_ID);
const solveButtonElement = document.getElementById(ELEMENT_SELECTORS.SOLVE_BUTTON_ID);
const sudokuBoardCells = document.querySelectorAll(`.${ELEMENT_SELECTORS.SUDOKU_CELL_CLASS}`);
const sudokuBoardElement = document.getElementById(ELEMENT_SELECTORS.SUDOKU_BOARD_ID);

document.addEventListener('DOMContentLoaded', () => {
  puzzleInputElement.value = SAMPLE_PUZZLE;

  setBoardListener();
  setPuzzleInputListener();
  setSolveButtonListener();
  setClearButtonListener();
  updateBoard(puzzleInputElement.value);
});

function setBoardListener() {
  sudokuBoardElement.addEventListener('input', updatePuzzleInput);
}

function setPuzzleInputListener() {
  puzzleInputElement.addEventListener('input', ({target: {value}}) => updateBoard(value));
}

function setSolveButtonListener() {
  solveButtonElement.addEventListener('click', () => solvePuzzle(puzzleInputElement.value));
}

function setClearButtonListener() {
  clearButtonElement.addEventListener('click', clearPuzzle);
}

function updatePuzzleInput({target}) {
  if(!target.classList.contains(ELEMENT_SELECTORS.SUDOKU_CELL_CLASS) || !isValidPuzzleCharacter(target.value)) {
    return;
  }

  const puzzlePartIndex = getPuzzlePartIndex(target.id);
  const puzzleValue = replacePuzzlePart(puzzleInputElement.value, target.value, puzzlePartIndex);

  resetPuzzleError();
  puzzleInputElement.value = puzzleValue;
}

function updateBoard(value) {
  const puzzle = value.split('');
  const error = validatePuzzle(puzzle);

  if(error) {
    return;
  }

  resetPuzzleError();
  puzzle.forEach((part, index) => sudokuBoardCells[index].value = part !== EMPTY_CELL_PLACEHOLDER ? part : '');
}

function solvePuzzle(value) {
  const puzzle = value.split('');
  const error = validatePuzzle(puzzle);

  if(error) {
    showPuzzleError(error);

    return;
  }

  resetPuzzleError();
  findPuzzleSolution();
}

function clearPuzzle() {
  const value = Array.from({length: VALID_PUZZLE_LENGTH}).map(() => '.').join('');

  puzzleInputElement.value = value;
  updateBoard(value);
}

function getPuzzlePartIndex(position) {
  const [_, column] = position.split('');
  const rowMultiplier = getRowMultiplier(position.charCodeAt(0));

  return rowMultiplier * 9 + Number(column) - 1;
}

function getRowMultiplier(code) {
  return code - BOARD_INITIAL_CHARACTER_CODE;
}

function replacePuzzlePart(value, replacement, index) {
  return `${value.substring(0, index)}${replacement || EMPTY_CELL_PLACEHOLDER}${value.substring(index + 1)}`;
}

function showPuzzleError(message) {
  errorMessageElement.innerText = message;
}

function resetPuzzleError() {
  errorMessageElement.innerText = '';
}

function findPuzzleSolution() {}

try {
  module.exports = {

  }
} catch (e) {}
