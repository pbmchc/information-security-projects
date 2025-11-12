import {
  BOARD_ROW_SIZE,
  EMPTY_CELL_PLACEHOLDER,
  SOLVED_PUZZLE_REGEX,
  VALID_PUZZLE_LENGTH,
} from './constants/constants.js';
import { ELEMENT_SELECTORS } from './constants/element-selectors.js';
import { PuzzleInspector } from './inspectors/puzzle.inspector.js';
import { puzzlesAndSolutions } from './puzzles/puzzle-strings.js';
import { getCurrentElementIndex } from './utils/puzzle.utils.js';
import {
  isValidPuzzleCharacter,
  validatePuzzleElements,
  validatePuzzleStructure,
} from './validators/puzzle-value.validator.js';

const BOARD_INITIAL_CHARACTER_CODE = 65;
const SAMPLE_PUZZLE = puzzlesAndSolutions[4][0];
const SOLUTION_NOT_FOUND_MESSAGE = 'No solutions found';

const clearButtonElement = document.getElementById(ELEMENT_SELECTORS.CLEAR_BUTTON_ID);
const errorMessageElement = document.getElementById(ELEMENT_SELECTORS.ERROR_MESSAGE_ID);
const puzzleInputElement = document.getElementById(ELEMENT_SELECTORS.SUDOKU_INPUT_ID);
const solveButtonElement = document.getElementById(ELEMENT_SELECTORS.SOLVE_BUTTON_ID);
const sudokuBoardCells = document.querySelectorAll(`.${ELEMENT_SELECTORS.SUDOKU_CELL_CLASS}`);
const sudokuBoardElement = document.getElementById(ELEMENT_SELECTORS.SUDOKU_BOARD_ID);

initializeSolver();

function initializeSolver() {
  puzzleInputElement.value = SAMPLE_PUZZLE;

  setBoardListener();
  setPuzzleInputListener();
  setSolveButtonListener();
  setClearButtonListener();
  updateBoard(puzzleInputElement.value);
}

function setBoardListener() {
  sudokuBoardElement.addEventListener('input', updatePuzzleInput);
}

function setPuzzleInputListener() {
  puzzleInputElement.addEventListener('input', ({ target: { value } }) => updateBoard(value));
}

function setSolveButtonListener() {
  solveButtonElement.addEventListener('click', () => {
    const puzzle = puzzleInputElement.value;

    if (canSolvePuzzle(puzzle)) {
      resetPuzzleError();
      solvePuzzle(puzzle);
    }
  });
}

function setClearButtonListener() {
  clearButtonElement.addEventListener('click', clearPuzzle);
}

function updatePuzzleInput({ target }) {
  if (!target.classList.contains(ELEMENT_SELECTORS.SUDOKU_CELL_CLASS)) {
    return;
  }

  const puzzlePartToReplace = isValidPuzzleCharacter(target.value) ? target.value : '.';
  const puzzlePartIndex = getPuzzlePartIndex(target.id);
  const puzzle = replacePuzzlePart(puzzleInputElement.value, puzzlePartToReplace, puzzlePartIndex);

  resetPuzzleError();
  puzzleInputElement.value = puzzle;
}

function updateBoard(puzzle) {
  const error = validatePuzzleStructure(puzzle);

  if (error) {
    return;
  }

  const puzzleArray = convertToPuzzleArray(puzzle);

  resetPuzzleError();
  puzzleArray.forEach(
    (part, index) => (sudokuBoardCells[index].value = part !== EMPTY_CELL_PLACEHOLDER ? part : '')
  );
}

function canSolvePuzzle(puzzle) {
  const error = validatePuzzleStructure(puzzle) || validatePuzzleElements(puzzle);

  if (error) {
    showPuzzleError(error);
  }

  return !error;
}

function solvePuzzle(puzzle) {
  const solution = getPuzzleSolution(puzzle);

  if (!solution) {
    puzzleInputElement.value = SOLUTION_NOT_FOUND_MESSAGE;
    return;
  }

  puzzleInputElement.value = solution;
  updateBoard(solution);
}

function clearPuzzle() {
  const puzzle = Array.from({ length: VALID_PUZZLE_LENGTH })
    .map(() => '.')
    .join('');

  puzzleInputElement.value = puzzle;
  updateBoard(puzzle);
}

function showPuzzleError(message) {
  errorMessageElement.innerText = message;
}

function resetPuzzleError() {
  errorMessageElement.innerText = '';
}

function getPuzzlePartIndex(position) {
  const [_, column] = position.split('');
  const rowMultiplier = getRowMultiplier(position.charCodeAt(0));

  return rowMultiplier * 9 + Number(column) - 1;
}

function getRowMultiplier(code) {
  return code - BOARD_INITIAL_CHARACTER_CODE;
}

export function convertToPuzzleArray(puzzle) {
  return puzzle.split('');
}

function isPuzzleSolved(puzzle) {
  return SOLVED_PUZZLE_REGEX.test(puzzle);
}

function isPuzzleValuePossible(puzzle, coordinates, value) {
  return !PuzzleInspector.hasDuplicates(puzzle, coordinates, {
    value: `${value}`,
    index: getCurrentElementIndex(coordinates),
  });
}

function replacePuzzlePart(puzzle, replacement, index) {
  return `${puzzle.substring(0, index)}${replacement || EMPTY_CELL_PLACEHOLDER}${puzzle.substring(
    index + 1
  )}`;
}

export function getPuzzleSolution(puzzle) {
  if (isPuzzleSolved(puzzle)) {
    return puzzle;
  }

  for (let row = 0; row < BOARD_ROW_SIZE; row++) {
    for (let column = 0; column < BOARD_ROW_SIZE; column++) {
      const coordinates = { row, column };
      const index = getCurrentElementIndex(coordinates);

      if (puzzle[index] === EMPTY_CELL_PLACEHOLDER) {
        for (let value = 1; value < BOARD_ROW_SIZE + 1; value++) {
          if (isPuzzleValuePossible(puzzle, coordinates, value)) {
            const solution = getPuzzleSolution(replacePuzzlePart(puzzle, value, index));

            if (solution) {
              return solution;
            }

            puzzle = replacePuzzlePart(puzzle, EMPTY_CELL_PLACEHOLDER, index);
          }
        }

        return null;
      }
    }
  }
}
