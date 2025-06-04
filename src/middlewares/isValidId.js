import createError from 'http-errors';

import { isValidObjectId } from 'mongoose';

export const isValidId = (req, resp, next) => {
  if (!isValidObjectId(req.params.contactId)) {
    next(createError.BadRequest('Id should be an ObjectId'));
  }
  next();
};
