import * as chai from 'chai';
import { JSDOM } from 'jsdom';

const { assert } = chai;

suite('UnitTests', () => {
  let Solver;
  let Validator;

  suiteSetup(async () => {
    const dom = await JSDOM.fromFile('./views/index.html');

    global.window = dom.window;
    global.document = dom.window.document;

    Solver = await import('../public/sudoku-solver.js');
    Validator = await import('../public/validators/puzzle-value.validator.js');
  });

  suite('Function isValidPuzzleCharacter()', () => {
    test('Valid "1-9" characters', () => {
      const input = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const result = input.map(Validator.isValidPuzzleCharacter).every((value) => value);

      assert.isTrue(result);
    });

    test('Invalid characters (anything other than "1-9") are not accepted', () => {
      const input = ['!', 'a', '/', '+', '-', '0', '10', 0, '.'];
      const result = input.map(Validator.isValidPuzzleCharacter).some((value) => value);

      assert.isFalse(result);
    });
  });

  suite('Functions convertToPuzzleArray() and validatePuzzleStructure()', () => {
    test('Parses a valid puzzle string into an object', () => {
      const puzzle =
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const expectedResult = puzzle.split('');
      const result = Solver.convertToPuzzleArray(puzzle);

      assert.deepEqual(result, expectedResult);
    });

    test('Shows an error for puzzles that are not 81 numbers long', () => {
      const shortPuzzle = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const longPuzzle =
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
      const expectedErrorMessage = 'Error: Expected puzzle to be 81 characters long.';

      const shortPuzzleErrorMessage = Validator.validatePuzzleStructure(shortPuzzle);
      const longPuzzleErrorMessage = Validator.validatePuzzleStructure(longPuzzle);

      assert.equal(shortPuzzleErrorMessage, expectedErrorMessage);
      assert.equal(longPuzzleErrorMessage, expectedErrorMessage);
    });
  });

  suite('Function validatePuzzleElements()', () => {
    test('Valid puzzles pass', () => {
      const puzzle =
        '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      const error = Validator.validatePuzzleElements(puzzle);

      assert.isNull(error);
    });

    test('Invalid puzzles fail', () => {
      const puzzle =
        '779235418851496372432178956174569283395842761628713549283657194516924837947381625';
      const expectedPuzzleError = 'Error: Puzzle has some duplicate characters';
      const error = Validator.validatePuzzleElements(puzzle);

      assert.equal(error, expectedPuzzleError);
    });
  });

  suite('Function getPuzzleSolution()', () => {
    test('Returns the expected solution for an incomplete puzzle', () => {
      const puzzle =
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const expectedSolution =
        '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      const solution = Solver.getPuzzleSolution(puzzle);

      assert.equal(solution, expectedSolution);
    });
  });
});
