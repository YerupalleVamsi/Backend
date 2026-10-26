const Joi = require("joi");

const passwordMessages = {
  'string.min': 'Password must be at least 8 characters long',
  'string.pattern.base': 'Password must contain at least one number',
  'any.required': 'Password is required'
};

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/[0-9]/) // Ensures at least one integer/digit
    .required()
    .messages(passwordMessages),
  age: Joi.number().integer().min(0).max(120).optional(),
  // FIX: `role` was missing. Spec says default "user".
  role: Joi.string().default("user")
});

const updateUserSchema = Joi.object({
  // FIX: was `ame:` (typo) — sending `name` in a PATCH got rejected as "not allowed".
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string()
    .min(8)
    .pattern(/[0-9]/)
    .optional()
    .messages(passwordMessages),
  age: Joi.number().integer().min(0).max(120).optional(),
  // FIX: `role` was missing. No default here, or every PATCH would reset role to "user".
  role: Joi.string().optional()
});

// FIX: two `module.exports =` lines — the second overwrote the first,
// so only updateUserSchema was exported and createUserSchema was undefined.
module.exports = { createUserSchema, updateUserSchema };
