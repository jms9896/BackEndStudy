const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // 비밀번호 없이 접근
  database: 'surveydb'
});

module.exports = pool;
