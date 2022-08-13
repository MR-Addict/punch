const Joi = require("joi");

const schema = Joi.object().keys({
  name: Joi.string().min(2).max(10).required(),
  notes: Joi.string().min(4).max(500).required(),
  group: Joi.string().valid("航模组", "电子组", "编程组", "静模组").required(),
});

module.exports = schema;
