import express from "express";
import { body } from "express-validator";
const router = express.Router();

import  {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile
}  from '../controller/user.controller.js'
import { authUser } from '../Middleware/auth.middleware.js'


// Response of this error will generate form controller
router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('Firstname must be at least 3 character long'),
    body('password').isLength({ min:6 }).withMessage('Password must be at least 6 character long')
],
    registerUser
)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Message'),
    body('password').isLength({min:6}).withMessage('Password Must be atleast 6 character long')
],
    loginUser
)

router.get('/profile', authUser, getUserProfile);

router.get('/logout', authUser, logoutUser);

export default router;