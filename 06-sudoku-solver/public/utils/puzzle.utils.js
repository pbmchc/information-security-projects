import { BOARD_ROW_SIZE } from '../constants/constants.js';

export function getCurrentElementIndex({ row, column }) {
  return row * BOARD_ROW_SIZE + column;
}
