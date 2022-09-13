const Joi = require("@hapi/joi");

exports.createNewsValidation = (data) => {
  const validationSchema = Joi.object({
    title: Joi.string().min(3).required(),
    body: Joi.string().min(3).required(),
    author: Joi.number().integer().required(),
  });
  return validationSchema.validate(data);
};

exports.updateNewsValidation = (data) => {
  const validationSchema = Joi.object({
    title: Joi.string().min(3).required(),
    body: Joi.string().min(3).required(),
    author: Joi.number().integer().required(),
  });
  return validationSchema.validate(data);
};
