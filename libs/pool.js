const mysql = require("mysql");

const pool_insert = mysql.createPool({
  connectionLimit: 10,
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
  multipleStatements: true,
});

pool_insert.getConnection((err, connection) => {
  if (err) console.error(err);
  else {
    console.log("Insert DB connected successfully!");
    connection.release();
  }
});

pool_select.getConnection((err, connection) => {
  if (err) console.error(err);
  else {
    console.log("Select DB connected successfully!");
    connection.release();
  }
});

module.exports = { pool_insert, pool_select };
