import express from 'express';
import {login} from '../controllers/authController';
const router = express.Router();
import {body} from 'express-validator';
import {validationErrors} from '../../middlewares';
import {usernameValidator} from '../../lib/validators';

router.post(
  '/login',
  usernameValidator(body('username')),
  body('password')
    .isString()
    .isLength({min: 5})
    .withMessage('Password must be at least 5 characters long'),
  validationErrors,
  login,
);

export default router;
