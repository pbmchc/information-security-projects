export const CANVAS_BASE_PADDING = 8;
export const CANVAS_FONT_SIZE = 14;

export const CANVAS_SIZE = {
  HEIGHT: 480,
  WIDTH: 640
};

export const DIRECTIONS = {
  LEFT: 'left',
  UP: 'up',
  RIGHT: 'right',
  DOWN: 'down'
};

export const DIRECTIONS_WITH_KEYS = {
  [DIRECTIONS.LEFT]: ['ArrowLeft', 'a'],
  [DIRECTIONS.UP]: ['ArrowUp', 'w'],
  [DIRECTIONS.RIGHT]: ['ArrowRight', 'd'],
  [DIRECTIONS.DOWN]: ['ArrowDown', 's']
};

export const EVENTS = {
  NEW_PLAYER: 'new-player',
  GAME_STATE_CHANGE: 'game-state-change',
  PLAYER_COLLECT: 'player-collect',
  PLAYER_MOVE: 'player-move'
};

export const GAMES_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};
