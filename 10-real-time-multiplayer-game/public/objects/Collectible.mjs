export const COLLECTIBLE_SIZE = 10;

class Collectible {
  constructor({ id, x, y, value }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.value = value;
  }
}

export default Collectible;
