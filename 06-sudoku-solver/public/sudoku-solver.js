import { puzzlesAndSolutions } from './puzzle-strings.js';

const EMPTY_CELL_PLACEHOLDER = '.';
const SAMPLE_PUZZLE = puzzlesAndSolutions[0][0];
const VALID_PUZZLE_LENGTH = 81;

const SUDOKU_CELL_CLASS = '.sudoku-input';
const SUDOKU_INPUT_ID = 'text-input';

const cells = document.querySelectorAll(SUDOKU_CELL_CLASS);
const puzzleInput = document.getElementById(SUDOKU_INPUT_ID);

document.addEventListener('DOMContentLoaded', () => {
  puzzleInput.value = SAMPLE_PUZZLE;
  setPuzzleInputListener();
  updateSudokuBoard(puzzleInput.value);
});

function setPuzzleInputListener() {
  puzzleInput.addEventListener('input', ({target: {value}}) => updateSudokuBoard(value));
}

function updateSudokuBoard(puzzle) {
  const values = puzzle.split('');

  if(values.length !== VALID_PUZZLE_LENGTH) {
    return;
  }

  values.forEach((value, index) => cells[index].value = value !== EMPTY_CELL_PLACEHOLDER ? value : '');
}

try {
  module.exports = {

  }
} catch (e) {}
