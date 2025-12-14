import express from 'express';
const router = express.Router();
const  followController = require('../controller/follow.controller');
const authMiddleware = require('../Middleware/auth.middleware');

router.post('/:id/toggle', authMiddleware.authUser, followController.followToggle);

export default router;
