import Joi from "joi";

export const registerValidationRules = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required().min(3).max(30).alphanum().messages({
    "string.base": `password should be Text`,
    "string.alphanum": `password should contain only characters and numbers`,
    "string.empty": `password cannot be empty`,
    "string.min": `password should have a minimum length of {#limit}`,
    "string.max": `password should have a maximum length of {#limit}`,
    "string.required": `password is a required`,
  }),

  repeat_password: Joi.ref("password"),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  avatar: Joi.string(),
}).with("password", "repeat_password");

export const loginValidationRules = Joi.object({
  password: Joi.string().required().min(3).max(30).messages({
    "string.base": `password should be Text`,
    "string.empty": `password cannot be empty`,
    "string.min": `password should have a minimum length of {#limit}`,
    "string.max": `password should have a maximum length of {#limit}`,
    "string.required": `password is a required`,
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  avatar: Joi.string(),
});
