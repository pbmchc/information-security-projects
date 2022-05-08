import { DIRECTIONS } from '../constants.mjs';

const DEFAULT_PLAYER_VELOCITY = 5;
export const PLAYER_SIZE = 20;

class Player {
  constructor({ id, x, y, directions = {}, score = 0 }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.directions = directions;
    this.score = score;
  }

  movePlayer(direction, velocity = DEFAULT_PLAYER_VELOCITY) {
    if (direction === DIRECTIONS.LEFT) this.x -= velocity;
    if (direction === DIRECTIONS.UP) this.y -= velocity;
    if (direction === DIRECTIONS.RIGHT) this.x += velocity;
    if (direction === DIRECTIONS.DOWN) this.y += velocity;
  }

  collision(item) {}

  calculateRank(arr) {}
}

export default Player;
