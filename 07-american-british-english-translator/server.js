import 'dotenv/config';

import express from 'express';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use('/static', express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.route('/').get(function (_, res) {
  res.sendFile('views/index.html', { root: import.meta.dirname });
});

app.use(function (_req, res, _next) {
  res.status(404).type('txt').send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app; // For FCC testing purposes
