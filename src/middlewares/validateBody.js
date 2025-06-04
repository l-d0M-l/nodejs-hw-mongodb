import createError from 'http-errors';

export const validateBody = (schema) => {
  return async (req, resp, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });

      next();
    } catch (error) {
      const errors = error.details.map((detail) => detail.message);

      next(createError.BadRequest(errors));
    }
  };
};
