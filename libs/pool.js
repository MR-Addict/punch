const mysql = require("mysql");
const users = [];
const analyze_command = {
  sum_cmd:
    "SELECT (SELECT COUNT(*) FROM `punch` WHERE DATE(`date`) = CURRENT_DATE) AS '今日提交',(SELECT COUNT(*) FROM `punch` WHERE WEEK(`date`,1) = WEEK(CURRENT_DATE(),1)) AS '本周提交',(SELECT COUNT(*) FROM `punch`) AS '所有提交'",
  group_cmd:
    "SELECT (SELECT COUNT(*) FROM `punch` WHERE `group`='航模组') AS '航模组',(SELECT COUNT(*) FROM `punch` WHERE `group`='编程组') AS '编程组',(SELECT COUNT(*) FROM `punch` WHERE `group`='电子组') AS '电子组',(SELECT COUNT(*) FROM `punch` WHERE `group`='静模组') AS '静模组'",
  days_cmd:
    "SELECT `date` AS '日期', COUNT(*) AS '提交次数' FROM `punch` GROUP BY DATE(`date`) ORDER BY `日期` DESC LIMIT 20",
};

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
