const chai = require("chai");
const assert = chai.assert;

const { ELEMENT_SELECTORS } = require('../public/constants/element-selectors.js');
const { VALID_PUZZLE_LENGTH } = require('../public/constants/constants.js');
const { puzzlesAndSolutions } = require('../public/puzzles/puzzle-strings.js');
let Solver;

suite('Functional Tests', () => {
  let clearButtonElement;
  let puzzleInputElement;
  let solveButtonElement;
  let sudokuBoardCells;
  const emptySudokuInputValue = Array.from({length: VALID_PUZZLE_LENGTH}).map(() => '.').join('');
  const getSudokuBoardValue = () => Array.from(sudokuBoardCells)
    .map(({value}) => value)
    .reduce((result, value) => result + value, '');

  suiteSetup(() => {
    Solver = require('../public/sudoku-solver.js');

    clearButtonElement = document.getElementById(ELEMENT_SELECTORS.CLEAR_BUTTON_ID);
    puzzleInputElement = document.getElementById(ELEMENT_SELECTORS.SUDOKU_INPUT_ID);
    solveButtonElement = document.getElementById(ELEMENT_SELECTORS.SOLVE_BUTTON_ID);
    sudokuBoardCells = document.querySelectorAll(`.${ELEMENT_SELECTORS.SUDOKU_CELL_CLASS}`);
  });
  
  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates 
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', done => {

      // done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', done => {

      // done();
    });
  });
  
  suite('Clear and solve buttons', () => {
    const [[puzzle, solution]] = puzzlesAndSolutions;

    test('Function clearPuzzle()', done => {
      const {InputEvent} = window;
      const puzzleInputEvent = new InputEvent('input');

      puzzleInputElement.value = puzzle;
      puzzleInputElement.dispatchEvent(puzzleInputEvent);
      clearButtonElement.click();

      assert.equal(puzzleInputElement.value, emptySudokuInputValue);
      assert.equal(getSudokuBoardValue(), '');

      done();
    });
    
    test('Function solvePuzzle(puzzle)', done => {
      const {InputEvent} = window;
      const puzzleInputEvent = new InputEvent('input');

      puzzleInputElement.value = puzzle;
      puzzleInputElement.dispatchEvent(puzzleInputEvent);
      solveButtonElement.click();

      assert.equal(puzzleInputElement.value, solution);
      assert.equal(getSudokuBoardValue(), solution);

      done();
    });
  });
});

