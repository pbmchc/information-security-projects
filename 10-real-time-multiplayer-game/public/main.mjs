import {
  CANVAS_BASE_PADDING,
  CANVAS_FONT_SIZE,
  CANVAS_SIZE,
  DIRECTIONS,
  DIRECTIONS_WITH_KEYS,
  EVENTS,
  GAMES_STATUS
} from './constants.mjs';
import Collectible, { COLLECTIBLE_SIZE } from './objects/Collectible.mjs';
import Player, { PLAYER_SIZE } from './objects/Player.mjs';
import { getRandomPosition } from './utils.mjs';

const socket = io();
const context = setupCanvas();

socket.on('connect', () => {
  let mainPlayer;
  let state = {
    collectible: {},
    players: [],
    status: GAMES_STATUS.INACTIVE
  };

  socket.emit(EVENTS.NEW_PLAYER);

  socket.on(EVENTS.GAME_STATE_CHANGE, newState => {
    const { players: statePlayers } = newState;
    const players = statePlayers.map(player => new Player(player));

    mainPlayer = players.find(({ id }) => id === socket.id);
    state = { ...newState, players };
  });

  document.addEventListener('keydown', event => {
    const { key } = event;
    const direction = getDirection(key);

    if (!direction) {
      return;
    }

    event.preventDefault();

    const isMovingInDirection = mainPlayer.directions[direction];

    if (isMovingInDirection) {
      return;
    }

    mainPlayer.directions[direction] = true;
    socket.emit(EVENTS.PLAYER_MOVE, mainPlayer);
  });

  document.addEventListener('keyup', event => {
    const { key } = event;
    const direction = getDirection(key);

    if (!direction) {
      return;
    }

    event.preventDefault();
    mainPlayer.directions[direction] = false;
    socket.emit(EVENTS.PLAYER_MOVE, mainPlayer);
  });
 
  renderGame();

  function renderGame() {
    const { collectible, players, status } = state;

    if (status === GAMES_STATUS.ACTIVE) {
      players.forEach(movePlayer);

      if (mainPlayer.collision(collectible)) {
        socket.emit(EVENTS.PLAYER_COLLECT, { player: mainPlayer, collectible });
      }
  
      drawCanvas();
      drawCanvasTobBar();
      drawCollectible(collectible);
      players.forEach(drawPlayer);
    }

    requestAnimationFrame(renderGame);
  }

  function getDirection(key) {
    return Object.keys(DIRECTIONS_WITH_KEYS).find(direction => DIRECTIONS_WITH_KEYS[direction].includes(key));
  }

  function movePlayer(player) {
    const { id, directions } = player;
    const activeDirections = Object.keys(directions).filter(key => directions[key]);

    activeDirections.forEach(direction => player.movePlayer(direction));
  }

  function drawCanvas() {
    context.fillStyle = '#eee';
    context.clearRect(0, 0, CANVAS_SIZE.WIDTH, CANVAS_SIZE.HEIGHT);
    context.fillRect(0, 0, CANVAS_SIZE.WIDTH, CANVAS_SIZE.HEIGHT);
  }

  function drawCanvasTobBar() {
    const { players } = state;
    const rank = mainPlayer.calculateRank(players);
    const score = `Score: ${mainPlayer.score}`;

    context.fillStyle = '#777';
    context.font = `${CANVAS_FONT_SIZE}px 'Press Start 2P'`;
    context.fillText(score, CANVAS_BASE_PADDING, CANVAS_FONT_SIZE * 2);
    context.fillText(rank, CANVAS_SIZE.WIDTH - context.measureText(rank).width - CANVAS_BASE_PADDING, CANVAS_FONT_SIZE * 2);
  }
  
  function drawCollectible(collectible) {
    context.fillStyle = '#66b2b2';
    context.fillRect(collectible.x, collectible.y, COLLECTIBLE_SIZE, COLLECTIBLE_SIZE);
  }

  function drawPlayer(player) {
    const { id } = player;
    const isMainPlayer = id === socket.id;
    
    context.fillStyle = isMainPlayer ? '#ff6666' : '#bebebe';
    context.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
  }
});

function setupCanvas() {
  const canvas = document.getElementById('game-canvas');

  canvas.height = CANVAS_SIZE.HEIGHT;
  canvas.width = CANVAS_SIZE.WIDTH;
  
  return canvas.getContext('2d');
}
