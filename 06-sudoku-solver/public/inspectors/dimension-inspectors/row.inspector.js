import { BOARD_ROW_SIZE } from '../../constants/constants.js';

export const RowInspector = (function() {
  function hasDuplicates(puzzle, {row}, {value, index}) {
    const rowStartIndex = Math.floor(row % BOARD_ROW_SIZE) * BOARD_ROW_SIZE;

    for(let i = rowStartIndex; i < rowStartIndex + BOARD_ROW_SIZE; i++) {
      if(puzzle[i] === value && i !== index) {
        return true;
      }
    }
  
    return false;
  }

  return { hasDuplicates };
} ());
