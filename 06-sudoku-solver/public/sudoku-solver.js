import { puzzlesAndSolutions } from './puzzle-strings.js';

const BOARD_INITIAL_CHARACTER_CODE = 65;
const EMPTY_CELL_PLACEHOLDER = '.';
const INVALID_PUZZLE_LENGTH_ERROR_MESSAGE = 'Error: Expected puzzle to be 81 characters long.';
const SAMPLE_PUZZLE = puzzlesAndSolutions[0][0];
const VALID_PUZZLE_LENGTH = 81;

const CLEAR_BUTTON_ID = 'clear-button';
const ERROR_MESSAGE_ID = 'error-msg';
const SOLVE_BUTTON_ID = 'solve-button';
const SUDOKU_BOARD_ID = 'sudoku-grid';
const SUDOKU_CELL_CLASS = 'sudoku-input';
const SUDOKU_INPUT_ID = 'text-input';

const clearButtonElement = document.getElementById(CLEAR_BUTTON_ID);
const errorMessageElement = document.getElementById(ERROR_MESSAGE_ID);
const puzzleInputElement = document.getElementById(SUDOKU_INPUT_ID);
const solveButtonElement = document.getElementById(SOLVE_BUTTON_ID);
const sudokuBoardCells = document.querySelectorAll(`.${SUDOKU_CELL_CLASS}`);
const sudokuBoardElement = document.getElementById(SUDOKU_BOARD_ID);

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
  if(!target.classList.contains(SUDOKU_CELL_CLASS)) {
    return;
  }

  const puzzlePartIndex = getPuzzlePartIndex(target.id);
  const puzzleValue = replacePuzzlePart(puzzleInputElement.value, target.value, puzzlePartIndex);

  puzzleInputElement.value = puzzleValue;
}

function updateBoard(value) {
  const puzzle = value.split('');

  if(!isPuzzleLengthValid(puzzle)) {
    return;
  }

  puzzle.forEach((part, index) => sudokuBoardCells[index].value = part !== EMPTY_CELL_PLACEHOLDER ? part : '');
}

function solvePuzzle(value) {
  const puzzle = value.split('');

  if(!isPuzzleLengthValid(puzzle)) {
    showPuzzleLengthError();

    return;
  }

  errorMessageElement.innerText = '';
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

function isPuzzleLengthValid(puzzle) {
  return puzzle.length === VALID_PUZZLE_LENGTH;
}

function showPuzzleLengthError() {
  errorMessageElement.innerText = INVALID_PUZZLE_LENGTH_ERROR_MESSAGE;
}

function findPuzzleSolution() {}

try {
  module.exports = {

  }
} catch (e) {}
