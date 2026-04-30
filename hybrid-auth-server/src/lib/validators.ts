import {body, param} from 'express-validator';

export const usernameValidator = (
  field: ReturnType<typeof body> | ReturnType<typeof param>,
  optional = false,
) => {
  let f = field;
  if (optional) {
    f = f.optional();
  }
  return f
    .trim()
    .escape()
    .isLength({min: 3, max: 50})
    .withMessage('Username must be between 3-50 characters')
    .matches(/^[\p{L}\s-]+$/u)
    .withMessage('Username can only contain letters, spaces, and hyphens');
};
