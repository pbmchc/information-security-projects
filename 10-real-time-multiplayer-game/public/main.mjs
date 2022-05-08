import { CANVAS_SIZE, DIRECTIONS, DIRECTIONS_WITH_KEYS, EVENTS } from './constants.mjs';
import Collectible, { COLLECTIBLE_SIZE } from './objects/Collectible.mjs';
import Player, { PLAYER_SIZE } from './objects/Player.mjs';
import { getRandomPosition } from './utils.mjs';

const socket = io();
const context = setupCanvas();

socket.on('connect', () => {
  const mainPlayer = new Player({ id: socket.id, ...getRandomPosition(PLAYER_SIZE) });
  let state = { players: [mainPlayer], collectible: {} };

  socket.emit(EVENTS.NEW_PLAYER, mainPlayer);

  socket.on(EVENTS.GAME_STATE_CHANGE, newState => {
    const { players } = newState;
    const otherPlayers = players
      .filter(player => player.id !== mainPlayer.id)
      .map(player => new Player(player));

    state = {
      ...newState,
      players: [mainPlayer, ...otherPlayers]
    };
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
 
  drawGame();

  function drawGame() {  
    const { players, collectible } = state;

    context.fillStyle = '#eee';
    context.clearRect(0, 0, CANVAS_SIZE.WIDTH, CANVAS_SIZE.HEIGHT);
    context.fillRect(0, 0, CANVAS_SIZE.WIDTH, CANVAS_SIZE.HEIGHT);

    drawCollectible(collectible);
    players.forEach(drawPlayer);

    requestAnimationFrame(drawGame);
  }
  
  function drawCollectible(collectible) {
    context.fillStyle = '#66b2b2';
    context.fillRect(collectible.x, collectible.y, COLLECTIBLE_SIZE, COLLECTIBLE_SIZE);
  }

  function drawPlayer(player) {
    const { directions } = player;
    const activeDirections = Object.keys(directions).filter(key => directions[key]);
    const isMainPlayer = player.id === mainPlayer.id;
    
    activeDirections.forEach(direction => player.movePlayer(direction));
    context.fillStyle = isMainPlayer ? '#ff6666' : '#bebebe';
    context.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
  }

  function getDirection(key) {
    return Object.keys(DIRECTIONS_WITH_KEYS).find(direction => DIRECTIONS_WITH_KEYS[direction].includes(key));
  }
});


function setupCanvas() {
  const canvas = document.getElementById('game-canvas');

  canvas.height = CANVAS_SIZE.HEIGHT;
  canvas.width = CANVAS_SIZE.WIDTH;
  
  return canvas.getContext('2d');
}
