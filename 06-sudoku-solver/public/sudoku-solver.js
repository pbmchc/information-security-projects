import { puzzlesAndSolutions } from './puzzle-strings.js';

const BOARD_INITIAL_CHARACTER_CODE = 65;
const EMPTY_CELL_PLACEHOLDER = '.';
const SAMPLE_PUZZLE = puzzlesAndSolutions[0][0];
const VALID_PUZZLE_LENGTH = 81;

const SUDOKU_BOARD_ID = 'sudoku-grid';
const SUDOKU_CELL_CLASS = 'sudoku-input';
const SUDOKU_INPUT_ID = 'text-input';

const cells = document.querySelectorAll(`.${SUDOKU_CELL_CLASS}`);
const puzzleInput = document.getElementById(SUDOKU_INPUT_ID);
const sudokuBoard = document.getElementById(SUDOKU_BOARD_ID);

document.addEventListener('DOMContentLoaded', () => {
  puzzleInput.value = SAMPLE_PUZZLE;

  setBoardListener();
  setPuzzleInputListener();
  updateBoard(puzzleInput.value);
});

function setBoardListener() {
  sudokuBoard.addEventListener('input', updatePuzzleInput);
}

function setPuzzleInputListener() {
  puzzleInput.addEventListener('input', ({target: {value}}) => updateBoard(value));
}

function updatePuzzleInput({target}) {
  if(!target.classList.contains(SUDOKU_CELL_CLASS)) {
    return;
  }

  const puzzlePartIndex = getPuzzlePartIndex(target.id);
  const puzzleValue = replacePuzzlePart(puzzleInput.value, target.value, puzzlePartIndex);

  puzzleInput.value = puzzleValue;
}

function updateBoard(value) {
  const puzzleParts = value.split('');

  if(puzzleParts.length !== VALID_PUZZLE_LENGTH) {
    return;
  }

  puzzleParts.forEach((part, index) => cells[index].value = part !== EMPTY_CELL_PLACEHOLDER ? part : '');
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

try {
  module.exports = {

  }
} catch (e) {}
