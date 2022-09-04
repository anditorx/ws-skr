const Joi = require("@hapi/joi");

exports.createOrganizationValidation = (data) => {
  const validationSchema = Joi.object({
    name: Joi.string().min(3).required(),
    phone_number: Joi.string().min(3).required(),
    address: Joi.string().min(3).required(),
    pic: Joi.number().integer().required(),
  });
  return validationSchema.validate(data);
};
