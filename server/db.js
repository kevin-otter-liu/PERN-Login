const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: '071802r0705',
  host: 'localhost',
  port: 5432,
  database: 'jwttutorial',
});

module.exports = pool;
