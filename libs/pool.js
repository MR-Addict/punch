const mysql = require("mysql");
const users = [];

const department_options = {
  技术开发部: "punch_js",
  组织策划部: "punch_zc",
  科普活动部: "punch_kp",
  新闻宣传部: "punch_xx",
  对外联络部: "punch_wl",
  双创联合服务部: "punch_sc",
};

const admin_analyze_command = {
  group_cmd:
    "SELECT (SELECT COUNT(*) FROM `punch_js`) AS '技术',(SELECT COUNT(*) FROM `punch_zc`) AS '组策',(SELECT COUNT(*) FROM `punch_kp`) AS '科普',(SELECT COUNT(*) FROM `punch_xx`) AS '新宣',(SELECT COUNT(*) FROM `punch_wl`) AS '外联',(SELECT COUNT(*) FROM `punch_sc`) AS '双创'",
};

const analyze_command = {
  sum_cmd:
    "SELECT (SELECT COUNT(*) FROM `punch` WHERE DATE(`date`) = CURRENT_DATE) AS '今日提交',(SELECT COUNT(*) FROM `punch` WHERE WEEK(`date`,1) = WEEK(CURRENT_DATE(),1)) AS '本周提交',(SELECT COUNT(*) FROM `punch`) AS '所有提交'",
  days_cmd:
    "SELECT `date` AS '日期', COUNT(*) AS '提交次数' FROM `punch` GROUP BY DATE(`date`) ORDER BY `日期` DESC LIMIT 20",
  group_cmd: {
    punch_js:
      "SELECT (SELECT COUNT(*) FROM `punch_js` WHERE `group`='航模组') AS '航模组',(SELECT COUNT(*) FROM `punch_js` WHERE `group`='编程组') AS '编程组',(SELECT COUNT(*) FROM `punch_js` WHERE `group`='电子组') AS '电子组',(SELECT COUNT(*) FROM `punch_js` WHERE `group`='静模组') AS '静模组'",
    punch_zc:
      "SELECT (SELECT COUNT(*) FROM `punch_zc` WHERE `group`='PU组') AS 'PU组',(SELECT COUNT(*) FROM `punch_zc` WHERE `group`='场地组') AS '场地组',(SELECT COUNT(*) FROM `punch_zc` WHERE `group`='财务组') AS '财务组',(SELECT COUNT(*) FROM `punch_zc` WHERE `group`='统筹组') AS '统筹组',(SELECT COUNT(*) FROM `punch_zc` WHERE `group`='人事组') AS '人事组'",
    punch_kp:
      "SELECT (SELECT COUNT(*) FROM `punch_kp` WHERE `group`='策划组') AS '策划组',(SELECT COUNT(*) FROM `punch_kp` WHERE `group`='财务组') AS '财务组',(SELECT COUNT(*) FROM `punch_kp` WHERE `group`='活动组') AS '活动组',(SELECT COUNT(*) FROM `punch_kp` WHERE `group`='外联组') AS '外联组'",
    punch_xx:
      "SELECT (SELECT COUNT(*) FROM `punch_xx` WHERE `group`='微信推送组') AS '微信推送组',(SELECT COUNT(*) FROM `punch_xx` WHERE `group`='视频海报组') AS '视频海报组',(SELECT COUNT(*) FROM `punch_xx` WHERE `group`='电子组') AS '电子组',(SELECT COUNT(*) FROM `punch_xx` WHERE `group`='摄影组') AS '摄影组'",
    punch_wl:
      "SELECT (SELECT COUNT(*) FROM `punch_wl` WHERE `group`='校内组') AS '校内组',(SELECT COUNT(*) FROM `punch_wl` WHERE `group`='校外组') AS '校外组',(SELECT COUNT(*) FROM `punch_wl` WHERE `group`='赞助组') AS '赞助组'",
    punch_sc: "SELECT `date` FROM `punch_sc` WHERE `date` < '2000-01-01'",
  },
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
  multipleStatements: true,
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

module.exports = { pool_insert, pool_select, users, department_options, analyze_command, admin_analyze_command };
