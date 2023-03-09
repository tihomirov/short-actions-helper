import express from 'express';

import { loginHandler, logoutHandler, registerHandler } from '../controllers';
import { deserializeUser, requireUser } from '../middleware';

export const authRouter = express.Router();

// Register user route
authRouter.post('/register', registerHandler);

// Login user route
authRouter.post('/login', loginHandler);

// Logout user route
authRouter.post('/logout', deserializeUser, requireUser, logoutHandler);
