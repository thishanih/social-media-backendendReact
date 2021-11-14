const Joi = require("joi");

const addNewsValidation = (data) => {
  const news_Schema = Joi.object({
    title: Joi.string().min(3).required(),
    message: Joi.string().min(10).required(),
  });

  return news_Schema.validate(data);
};

module.exports.addNewsValidation = addNewsValidation;
