import 'dotenv/config';

import http from 'node:http';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import nocache from 'nocache';
import { Server } from 'socket.io';

import { setupGameServer } from './realtime-game-server.js';
import { setupTestingRoutes } from './routes/fcctesting.js';
import runner from './test-runner.js';

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({ origin: '*' })); // For FCC testing purposes
app.use(express.json());
app.use('/static', express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(helmet.hidePoweredBy({ setTo: 'PHP 7.4.3' }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(nocache());

app.route('/').get(function (_, res) {
  res.sendFile('views/index.html', { root: import.meta.dirname });
});

setupTestingRoutes(app); // For FCC testing purposes
setupGameServer(io);

app.use(function (_req, res, _next) {
  res.status(404).type('txt').send('Not Found');
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (err) {
        console.log('Error while running tests:');
        console.log(err);
      }
    }, 1500);
  }
});

export default app; // For FCC testing purposes
