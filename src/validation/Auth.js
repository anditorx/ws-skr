const Joi = require("@hapi/joi");

exports.registerValidation = (data) => {
  const validationSchema = Joi.object({
    fullName: Joi.string().min(6).required(),
    email: Joi.string().required().email(),
    username: Joi.string().min(4).required(),
    password: Joi.string().min(6).required(),
  });
  return validationSchema.validate(data);
};
exports.loginValidation = (data) => {
  const validationSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  });
  return validationSchema.validate(data);
};
