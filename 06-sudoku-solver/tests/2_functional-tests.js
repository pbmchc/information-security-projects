import * as chai from 'chai';

import { VALID_PUZZLE_LENGTH } from '../public/constants/constants.js';
import { ELEMENT_SELECTORS } from '../public/constants/element-selectors.js';
import { puzzlesAndSolutions } from '../public/puzzles/puzzle-strings.js';

const { assert } = chai;

suite('Functional Tests', () => {
  let clearButtonElement;
  let puzzleInputElement;
  let solveButtonElement;
  let sudokuBoardCells;

  const [[puzzle, solution]] = puzzlesAndSolutions;

  const getBoardValue = () =>
    Array.from(sudokuBoardCells)
      .map(({ value }) => value)
      .reduce((result, value) => result + value, '');

  const updatePuzzleCell = (puzzle, { index, value }) =>
    `${puzzle.substring(0, index)}${value}${puzzle.substring(index + 1)}`;

  suiteSetup(async () => {
    await import('../public/sudoku-solver.js');

    clearButtonElement = document.getElementById(ELEMENT_SELECTORS.CLEAR_BUTTON_ID);
    puzzleInputElement = document.getElementById(ELEMENT_SELECTORS.SUDOKU_INPUT_ID);
    solveButtonElement = document.getElementById(ELEMENT_SELECTORS.SOLVE_BUTTON_ID);
    sudokuBoardCells = document.querySelectorAll(`.${ELEMENT_SELECTORS.SUDOKU_CELL_CLASS}`);
  });

  suite('Text area and sudoku grid update automatically', () => {
    test('Valid number in text area populates correct cell in grid', () => {
      const { InputEvent } = window;
      const puzzleInputEvent = new InputEvent('input');
      const change = { index: 1, value: '3' };
      const updatePuzzle = updatePuzzleCell(puzzle, change);

      puzzleInputElement.value = puzzle;
      puzzleInputElement.dispatchEvent(puzzleInputEvent);
      puzzleInputElement.value = updatePuzzle;
      puzzleInputElement.dispatchEvent(puzzleInputEvent);

      assert.equal(sudokuBoardCells[change.index].value, change.value);
    });

    test('Valid number in grid updates the puzzle string in the text area', () => {
      const { InputEvent } = window;
      const puzzleInputEvent = new InputEvent('input');
      const sudokuCellInputEvent = new InputEvent('input', { bubbles: true });

      const change = { index: 1, value: '3' };
      const sudokuCellInput = sudokuBoardCells[change.index];
      const expectedPuzzleInputValue = updatePuzzleCell(puzzle, change);

      puzzleInputElement.value = puzzle;
      puzzleInputElement.dispatchEvent(puzzleInputEvent);
      sudokuCellInput.value = change.value;
      sudokuCellInput.dispatchEvent(sudokuCellInputEvent);

      assert.equal(puzzleInputElement.value, expectedPuzzleInputValue);
    });
  });

  suite('Clear and solve buttons', () => {
    test('Function clearPuzzle()', () => {
      const { InputEvent } = window;
      const puzzleInputEvent = new InputEvent('input');

      const emptyInputValue = Array.from({ length: VALID_PUZZLE_LENGTH }, () => '.').join('');

      puzzleInputElement.value = puzzle;
      puzzleInputElement.dispatchEvent(puzzleInputEvent);
      clearButtonElement.click();

      assert.equal(puzzleInputElement.value, emptyInputValue);
      assert.equal(getBoardValue(), '');
    });

    test('Function solvePuzzle(puzzle)', () => {
      const { InputEvent } = window;
      const puzzleInputEvent = new InputEvent('input');

      puzzleInputElement.value = puzzle;
      puzzleInputElement.dispatchEvent(puzzleInputEvent);
      solveButtonElement.click();

      assert.equal(puzzleInputElement.value, solution);
      assert.equal(getBoardValue(), solution);
    });
  });
});
