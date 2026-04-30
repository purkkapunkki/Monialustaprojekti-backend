import express from 'express';
import {
  checkEmailExists,
  checkToken,
  checkUsernameExists,
  userDelete,
  userDeleteAsAdmin,
  userGet,
  userListGet,
  userPost,
  userPut,
  userPutAsAdmin,
} from '../controllers/userController';
import {authenticate, validationErrors} from '../../middlewares';
import {usernameValidator} from '../../lib/validators';
import {body, param} from 'express-validator';

const router = express.Router();

router.get('/', userListGet);

router.post(
  '/',
  usernameValidator(body('username')),
  body('password')
    .isString()
    .isLength({min: 5})
    .withMessage('Password must be at least 5 characters long'),
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email format'),
  validationErrors,
  userPost,
);

router.put(
  '/',
  authenticate,
  usernameValidator(body('username'), true),
  body('password')
    .optional()
    .isString()
    .isLength({min: 5})
    .withMessage('Password must be at least 5 characters long'),
  body('email')
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email format'),
  validationErrors,
  userPut,
);

router.delete('/', authenticate, userDelete);

router.get('/token', authenticate, checkToken);

router.route('/:id').get(param('id').isNumeric(), validationErrors, userGet);

router
  .route('/:id')
  .put(
    authenticate,
    param('id').isNumeric(),
    usernameValidator(body('username'), true),
    body('password')
      .optional()
      .isString()
      .isLength({min: 5})
      .withMessage('Password must be at least 5 characters long'),
    body('email')
      .optional()
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Invalid email format'),
    validationErrors,
    userPutAsAdmin,
  );

router
  .route('/:id')
  .delete(
    authenticate,
    param('id').isNumeric(),
    validationErrors,
    userDeleteAsAdmin,
  );

router.get(
  '/email/:email',
  param('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email format'),
  validationErrors,
  checkEmailExists,
);

router.get(
  '/username/:username',
  usernameValidator(param('username')),
  validationErrors,
  checkUsernameExists,
);

export default router;
