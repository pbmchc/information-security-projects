export const COLLECTIBLE_SIZE = 10;
const COLLECTIBLE_VALUES = { LOW: 1, MEDIUM: 2, HIGH: 3 };
const COLLECTIBLE_COLORS = {
  [COLLECTIBLE_VALUES.LOW]: '#66b2b2',
  [COLLECTIBLE_VALUES.MEDIUM]: '#668cb2',
  [COLLECTIBLE_VALUES.HIGH]: '#b2668c'
};


class Collectible {
  constructor({ id, x, y, value = this._getRandomValue() }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.value = value;
    this.color = COLLECTIBLE_COLORS[value];
  }

  _getRandomValue() {
    const threshold = Math.random();

    if (threshold > 0.9) return COLLECTIBLE_VALUES.HIGH;
    if (threshold > 0.7) return COLLECTIBLE_VALUES.MEDIUM;
    
    return COLLECTIBLE_VALUES.LOW;
  }
}

export default Collectible;
