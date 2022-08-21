const mysql = require("mysql");
const users = [];
const analyze_command =
  "SELECT (SELECT COUNT(*) FROM `punch`) AS 'all',(SELECT COUNT(*) FROM `punch` WHERE DATE(`date`) > DATE_SUB(NOW(), INTERVAL 1 WEEK)) AS 'week',(SELECT COUNT(*) FROM `punch` WHERE DATE(`date`) = CURRENT_DATE) AS 'today'";

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

pool_select.query("SELECT * FROM admin", function (err, result, fields) {
  if (err) {
    console.error(err);
  } else {
    result.forEach(function (user) {
      users.push(user);
    });
  }
});

module.exports = { pool_insert, pool_select, users, analyze_command };
