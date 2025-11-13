import { CANVAS_SIZE, DIRECTIONS } from '../constants.mjs';

const { WIDTH: CANVAS_WIDTH, HEIGHT: CANVAS_HEIGHT } = CANVAS_SIZE;
const DEFAULT_PLAYER_VELOCITY = 5;
export const PLAYER_SIZE = 25;

class Player {
  constructor({ id, x, y, directions = {}, score = 0 }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.directions = directions;
    this.score = score;
  }

  calculateRank(players) {
    const playersWithHigherScore = players.filter(({ score }) => score > this.score);
    const place = playersWithHigherScore.length + 1;
    const numberOfPlayers = players.length;

    return `Rank: ${place}/${numberOfPlayers}`;
  }

  collision(collectible) {
    const { x, y } = collectible;
    const isHorizontalCollision = this.x <= x && this.x + PLAYER_SIZE >= x;
    const isVerticalCollision = this.y <= y && this.y + PLAYER_SIZE >= y;

    return isHorizontalCollision && isVerticalCollision;
  }

  movePlayer(direction, velocity = DEFAULT_PLAYER_VELOCITY) {
    const { x, y } = this;

    if (direction === DIRECTIONS.LEFT) this.x = this.#moveBackwards(x, velocity);
    if (direction === DIRECTIONS.UP) this.y = this.#moveBackwards(y, velocity);
    if (direction === DIRECTIONS.RIGHT) this.x = this.#moveForwards(x, velocity, CANVAS_WIDTH);
    if (direction === DIRECTIONS.DOWN) this.y = this.#moveForwards(y, velocity, CANVAS_HEIGHT);
  }

  #moveBackwards(position, velocity) {
    const newPosition = position - velocity;
    return newPosition < 0 ? 0 : newPosition;
  }

  #moveForwards(position, velocity, canvasSize) {
    const newPosition = position + velocity;
    return newPosition > canvasSize - PLAYER_SIZE ? canvasSize - PLAYER_SIZE : newPosition;
  }
}

export default Player;
