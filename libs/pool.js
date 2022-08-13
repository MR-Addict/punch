const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 4,
  host: "localhost",
  user: "punch",
  password: "password",
  database: "punch",
});

pool.getConnection((err, connection) => {
  if (err) console.error(err);
  else {
    console.log("MySQL Connected successfully!");
    connection.release();
  }
});

module.exports = pool;
