import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'The name is too short (min - 3)',
    'string.max': 'The name is too long (max - 20)',
    'string.empty': 'The name cannot be empty string',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9\s\-()]{7,20}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be valid',
      'string.empty': 'Phone number must be valid',
      'any.required': 'Phone number must be valid',
    }),
  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required',
  }),
  isFavourite: Joi.boolean(),
  contactsType: Joi.string().valid('work', 'home', 'personal'),
});

export const updateStudentSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.min': 'The name is too short (min - 3)',
    'string.max': 'The name is too long (max - 20)',
    'string.empty': 'The name cannot be empty string',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9\s\-()]{7,20}$/)
    .messages({
      'string.pattern.base': 'Phone number must be valid',
      'string.empty': 'Phone number must be valid',
      'any.required': 'Phone number must be valid',
    }),
  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required',
  }),
  isFavourite: Joi.boolean(),
  contactsType: Joi.string().valid('work', 'home', 'personal'),
});
