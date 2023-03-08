import express from 'express';

import { getAllUsersHandler, getCurrentUserHandler } from '../controllers';
import { deserializeUser, requireUser, restrictTo } from '../middleware';

export const userRouter = express.Router();

userRouter.use(deserializeUser, requireUser);

userRouter.get('/', restrictTo('admin'), getAllUsersHandler);
userRouter.get('/current-user', getCurrentUserHandler);
