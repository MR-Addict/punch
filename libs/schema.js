const Joi = require("joi");

// Notes validation schema
const schema = Joi.object().keys({
  group: Joi.string().min(2).max(10).required(),
  name: Joi.string().min(2).max(10).required(),
  notes: Joi.string().min(4).max(500).required(),
});

module.exports = schema;
