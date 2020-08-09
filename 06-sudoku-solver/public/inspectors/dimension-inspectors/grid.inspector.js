import { getCurrentElementIndex } from '../../utils/puzzle.utils.js';

export const GridInspector = (function() {
  function hasDuplicates(puzzle, {row, column}, {value, index}) {
    const rowStartIndex = getStartIndex(row);
    const columnStartIndex = getStartIndex(column);
  
    for(let i = rowStartIndex; i < rowStartIndex + 3; i++) {
      for(let j = columnStartIndex; j < columnStartIndex + 3; j++) {
        const currentElementIndex = getCurrentElementIndex({row, column});
  
        if(puzzle[currentElementIndex] === value && currentElementIndex !== index) {
          return true;
        }
      }
    }

    return false;
  }

  function getStartIndex(dimension) {
    return Math.floor(dimension / 3) * 3;
  }

  return { hasDuplicates };
} ());
