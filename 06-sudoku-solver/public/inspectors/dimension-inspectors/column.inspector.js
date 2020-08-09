import { BOARD_ROW_SIZE } from '../../constants/constants.js';

export const ColumnInspector = (function() {
  function hasDuplicates(puzzle, {column}, {value, index}) {
    for(let i = 0; i < BOARD_ROW_SIZE; i++) {
      const currentElementIndex = column + i * BOARD_ROW_SIZE;
  
      if(puzzle[currentElementIndex] === value && currentElementIndex !== index) {
        return true;
      }
    }
  
    return false;
  }

  return { hasDuplicates };
} ());
