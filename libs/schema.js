const Joi = require("joi");

const form_schema = Joi.object().keys({
  name: Joi.string().min(2).max(10).required(),
  notes: Joi.string().min(4).max(500).required(),
  group: Joi.string().valid("航模组", "电子组", "编程组", "静模组").required(),
});

const sql_schema = Joi.object().keys({
  command: Joi.string().min(1).max(200).required(),
});

module.exports = { form_schema, sql_schema };
