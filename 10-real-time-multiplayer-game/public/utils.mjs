import { CANVAS_SIZE } from './constants.mjs';

export function getRandomPosition(itemSize) {
  return {
    x: Math.floor(Math.random() * (CANVAS_SIZE.WIDTH - itemSize)),
    y: Math.floor(Math.random() * (CANVAS_SIZE.HEIGHT - itemSize)),
  };
}
