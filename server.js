const express = require('express');
require('dotenv').config();

// Require routes
const { ApiNavRouter } = require('./routes/api-nav-router');
const { UsersRouter } = require('./routes/employees-router');
const { AuthsRouter } = require('./routes/auths-router');
const { ArticlesRouter } = require('./routes/articles-router');

const { urlencoded, json } = express;

const server = express();
server.use([urlencoded({ extended: true }), json()]);

server.use('/', ApiNavRouter);
server.use('/api/v1.0.1', [UsersRouter, AuthsRouter, ArticlesRouter]);

// Listen for server daemon
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
