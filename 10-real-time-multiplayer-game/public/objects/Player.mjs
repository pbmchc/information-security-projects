import { DIRECTIONS } from '../constants.mjs';

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

  movePlayer(direction, velocity = DEFAULT_PLAYER_VELOCITY) {
    if (direction === DIRECTIONS.LEFT) this.x -= velocity;
    if (direction === DIRECTIONS.UP) this.y -= velocity;
    if (direction === DIRECTIONS.RIGHT) this.x += velocity;
    if (direction === DIRECTIONS.DOWN) this.y += velocity;
  }

  collision(collectible) {
    const { x, y } = collectible;
    const isHorizontalCollision = this.x <= x && this.x + PLAYER_SIZE >= x;
    const isVerticalCollision = this.y <= y && this.y + PLAYER_SIZE >= y;

    return isHorizontalCollision && isVerticalCollision;
  }

  calculateRank(players) {
    const playersWithHigherScore = players.filter(({ score }) => score > this.score);
    const place = playersWithHigherScore.length + 1;
    const numberOfPlayers = players.length;

    return `Rank: ${place}/${numberOfPlayers}`;
  }
}

export default Player;
