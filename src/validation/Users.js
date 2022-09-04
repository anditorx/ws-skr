const Joi = require("@hapi/joi");

exports.userPutValidation = (data) => {
  const validationSchema = Joi.object({
    fullName: Joi.string().min(6).required(),
    email: Joi.string().required().email(),
    username: Joi.string().min(4).required(),
    password: Joi.string().min(6).required(),
  });
  return validationSchema.validate(data);
};
