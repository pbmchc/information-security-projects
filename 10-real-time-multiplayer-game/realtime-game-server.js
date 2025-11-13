import { EVENTS, GAMES_STATUS } from './public/constants.mjs';
import Collectible, { COLLECTIBLE_SIZE } from './public/objects/Collectible.mjs';
import Player, { PLAYER_SIZE } from './public/objects/Player.mjs';
import { getRandomPosition } from './public/utils.mjs';

let state = {
  collectible: createNewCollectible(),
  players: [],
  status: GAMES_STATUS.INACTIVE,
};

function createNewCollectible(id = Date.now()) {
  return new Collectible({ id, ...getRandomPosition(COLLECTIBLE_SIZE) });
}

function createNewPlayer(id) {
  return new Player({ id, ...getRandomPosition(PLAYER_SIZE) });
}

export const setupGameServer = (io) => {
  io.on('connection', (socket) => {
    socket.on(EVENTS.NEW_PLAYER, () => {
      const { id } = socket;
      const { players } = state;

      state = {
        ...state,
        players: [...players, createNewPlayer(id)],
        status: GAMES_STATUS.ACTIVE,
      };

      io.emit(EVENTS.GAME_STATE_CHANGE, state);
    });

    socket.on(EVENTS.PLAYER_MOVE, (movingPlayer) => {
      const { players } = state;

      state = {
        ...state,
        players: players.map((player) =>
          player.id === movingPlayer.id ? { ...movingPlayer } : player
        ),
      };

      io.emit(EVENTS.GAME_STATE_CHANGE, state);
    });

    socket.on(EVENTS.PLAYER_COLLECT, ({ player: scoringPlayer, collectible }) => {
      const { players, collectible: stateCollectible } = state;
      const isActiveCollectible = stateCollectible.id === collectible.id;

      if (!isActiveCollectible) {
        return;
      }

      state = {
        ...state,
        collectible: createNewCollectible(),
        players: players.map((player) =>
          player.id === scoringPlayer.id
            ? { ...scoringPlayer, score: scoringPlayer.score + collectible.value }
            : player
        ),
      };

      io.emit(EVENTS.GAME_STATE_CHANGE, state);
    });

    socket.on('disconnect', () => {
      const { players } = state;

      state = {
        ...state,
        players: players.filter((player) => player.id !== socket.id),
      };

      io.emit(EVENTS.GAME_STATE_CHANGE, state);
    });
  });
};
