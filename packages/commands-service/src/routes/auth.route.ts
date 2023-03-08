import express from 'express';

import { loginHandler, registerHandler } from '../controllers';

export const authRouter = express.Router();

// Register user route
authRouter.post('/register', registerHandler);

// Login user route
authRouter.post('/login', loginHandler);
