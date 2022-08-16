const mysql = require("mysql");

const pool_insert = mysql.createPool({
  connectionLimit: 4,
  host: "localhost",
  user: "punch_insert",
  password: "password",
  database: "punch",
});

const pool_select = mysql.createPool({
  connectionLimit: 4,
  host: "localhost",
  user: "punch_select",
  password: "password",
  database: "punch",
});

pool_insert.getConnection((err, connection) => {
  if (err) console.error(err);
  else {
    console.log("MySQL Connected successfully!");
    connection.release();
  }
});

module.exports = { pool_insert, pool_select };
