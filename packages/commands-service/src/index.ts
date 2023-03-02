import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import expressSession from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';

import { authRouter, commandRouter } from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

if (process.env.DB_URL) {
  mongoose.set('strictQuery', false);
  mongoose.connect(process.env.DB_URL);
} else {
  throw new Error('Database URL is not define in .env config');
}

app.use(express.json());
app.use(
  expressSession({
    secret: 'remote-shortcuts',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/command', commandRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
