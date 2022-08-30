const Joi = require("joi");

const form_schema = Joi.object().keys({
  name: Joi.string().max(10).required(),
  notes: Joi.string().min(4).max(500).required(),
  group: Joi.string().valid(
    "航模组",
    "电子组",
    "编程组",
    "静模组",

    "PU组",
    "场地组",
    "财务组",
    "统筹组",
    "人事组",

    "策划组",
    "财务组",
    "活动组",
    "外联组",

    "微信推送组",
    "视频海报组",
    "摄影组",

    "校外组",
    "校外组",
    "赞助组"
  ),
});

const sql_schema = Joi.object().keys({
  command: Joi.string().max(200).required(),
});

module.exports = { form_schema, sql_schema };
