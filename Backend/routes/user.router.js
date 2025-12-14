const express = require('express');
const router = express.Router();
const { body } = require("express-validator")
import userController from '../controller/user.controller.js'
import authMiddleware from '../Middleware/auth.middleware.js'


// Response of this error will generate form controller
router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('Firstname must be at least 3 character long'),
    body('password').isLength({ min:6 }).withMessage('Password must be at least 6 character long')
],
    userController.registerUser
)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Message'),
    body('password').isLength({min:6}).withMessage('Password Must be atleast 6 character long')
],
    userController.loginUser
)

router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

router.get('/logout', authMiddleware.authUser, userController.logoutUser);

export default router;