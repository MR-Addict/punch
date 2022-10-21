const mysql = require("mysql");
const analyze_command = {
  cards_sql:
    "SELECT (SELECT COUNT(*) FROM `punch` WHERE DATE(`date`) = CURRENT_DATE) AS '今日提交',(SELECT COUNT(*) FROM `punch` WHERE WEEK(`date`,1) = WEEK(CURRENT_DATE(),1)) AS '本周提交',(SELECT COUNT(*) FROM `punch` WHERE MONTH(`date`) = MONTH(CURRENT_DATE())) AS '本月提交',(SELECT COUNT(*) FROM `punch`) AS '所有提交'",
  weeks_sql:
    "SELECT WEEK(date) AS `周次`,COUNT(*) AS '航模组' FROM `punch` WHERE `group`='航模组' GROUP BY WEEK(date);SELECT WEEK(date) AS `周次`,COUNT(*) AS '编程组' FROM `punch` WHERE `group`='编程组' GROUP BY WEEK(date);SELECT WEEK(date) AS `周次`,COUNT(*) AS '电子组' FROM `punch` WHERE `group`='电子组' GROUP BY WEEK(date);SELECT WEEK(date) AS `周次`,COUNT(*) AS '静模组' FROM `punch` WHERE `group`='静模组' GROUP BY WEEK(date);SELECT COUNT(*) AS '周次' FROM `punch` GROUP BY WEEK(date)",
  days_sql: "SELECT `date` AS '时间', COUNT(*) AS '次数' FROM `punch` GROUP BY DATE(`date`) ORDER BY `时间`",
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
  host: "mraddict.top",
  user: "cael",
  password: "@Cjw20001212",
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

module.exports = { pool_insert, pool_select, analyze_command };
