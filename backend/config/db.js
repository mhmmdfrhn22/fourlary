const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
connection.connect(err => {
  if (err) console.error('DB Connection Error:', err);
  else console.log('Connected to DB');
});
module.exports = connection;