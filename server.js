const express = require('express');
require('dotenv').config();

const { urlencoded, json } = express;

const server = express();
server.use([urlencoded({ extended: true }), json()]);

const normalizePort = () => {
  const port = parseInt(process.env.PORT, 10);
  if (Number.isNaN(port) && typeof process.env.PORT !== 'undefined') return process.env.PORT;
  if (port >= 0) return port;
  return 3000;
};

const port = normalizePort();
const hostname = process.env.HOSTNAME || 'localhost';

// eslint-disable-next-line no-console
server.listen(port, () => console.log(`Server listening on ${hostname}:${port}`));
