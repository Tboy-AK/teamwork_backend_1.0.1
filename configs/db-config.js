const { Pool } = require('pg');

const connObj = {};

switch (process.env.NODE_ENV) {
  case 'development':
    connObj.connectionString = process.env.DEV_DATABASE_URL;
    break;
  case 'test':
    connObj.user = process.env.TEST_USER;
    connObj.password = process.env.TEST_PASSWORD;
    connObj.host = process.env.TEST_HOST;
    connObj.port = process.env.TEST_PORT;
    connObj.database = process.env.TEST_DATABASE;
    break;
  default:
    connObj.connectionString = process.env.DATABASE_URL;
    break;
}

module.exports = new Pool(connObj);
