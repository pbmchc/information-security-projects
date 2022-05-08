require('dotenv').config();

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const { Server } = require('socket.io');
const cors = require('cors');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const { EVENTS } = require('./public/constants.mjs');
const { default: Collectible, COLLECTIBLE_SIZE } = require('./public/objects/Collectible.mjs');
const { getRandomPosition } = require('./public/utils.mjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: '*' })); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);

  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

let state = {
  players: [],
  collectible: new Collectible(getRandomPosition(COLLECTIBLE_SIZE))
};

io.on('connection', socket => {
  socket.on(EVENTS.NEW_PLAYER, player => {
    const { players } = state;

    state = {
      ...state,
      players: [...players, player]
    };

    io.emit(EVENTS.GAME_STATE_CHANGE, state);
  });

  socket.on(EVENTS.PLAYER_MOVE, movingPlayer => {
    const { players } = state;

    state = {
      ...state,
      players: players.map(player => player.id === movingPlayer.id ? ({ ...movingPlayer }) : player)
    };

    io.emit(EVENTS.GAME_STATE_CHANGE, state);
  });

  socket.on('disconnect', () => {
    const { players } = state;

    state = {
      ...state,
      players: players.filter(player => player.id !== socket.id)
    };

    io.emit(EVENTS.GAME_STATE_CHANGE, state);
  });
});


module.exports = app; // For testing
