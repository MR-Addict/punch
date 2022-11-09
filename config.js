const sql_cmds = {
  insight: {
    cards_sql:
      "SELECT (SELECT COUNT(*) FROM `punch` WHERE DATE(`date`) = CURRENT_DATE) AS '今日提交',(SELECT COUNT(*) FROM `punch` WHERE WEEK(`date`,1) = WEEK(CURRENT_DATE(),1)) AS '本周提交',(SELECT COUNT(*) FROM `punch` WHERE MONTH(`date`) = MONTH(CURRENT_DATE())) AS '本月提交',(SELECT COUNT(*) FROM `punch`) AS '所有提交'",
    weeks_sql:
      "SELECT WEEK(`date`) AS `周次`,COUNT(*) AS '航模组' FROM `punch` WHERE `group`='航模组' GROUP BY WEEK(`date`);SELECT WEEK(`date`) AS `周次`,COUNT(*) AS '编程组' FROM `punch` WHERE `group`='编程组' GROUP BY WEEK(`date`);SELECT WEEK(`date`) AS `周次`,COUNT(*) AS '电子组' FROM `punch` WHERE `group`='电子组' GROUP BY WEEK(`date`);SELECT WEEK(`date`) AS `周次`,COUNT(*) AS '静模组' FROM `punch` WHERE `group`='静模组' GROUP BY WEEK(`date`);SELECT COUNT(*) AS '周次' FROM `punch` GROUP BY WEEK(`date`)",
    days_sql: "SELECT `date` AS '时间', COUNT(*) AS '次数' FROM `punch` GROUP BY DATE(`date`) ORDER BY `时间`",
  },
  select: {
    admin_sql: "SELECT * FROM `admin`",
    tabl_sql: "SELECT * FROM `punch` ORDER BY `id` DESC",
    export_sql: "SELECT * FROM `punch` ORDER BY `id` DESC",
  },
};

const JWT = {
  secret: "LOGIN_SECRET_KEY",
  token_name: "accessTOken",
  expire_time: 30 * 60 * 1000,
};

module.exports = { sql_cmds, JWT };
