import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { authRouter, commandRouter, userRouter } from './routes';
import { connectDB, connectRedis } from './utils';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// app.use(
//   cors({
//     origin: config.get<string>('origin'),
//     credentials: true,
//   }),
// );

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/command', commandRouter);

app.get('/healthChecker', (req: Request, res: Response) => {
  res.status(200).json(ResponseFactory.success({ message: 'Welcome' }));
});

// UnKnown Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  return res.status(err.statusCode).json(ResponseFactory.fail({ message: err.message }));
});

console.log(`[server]: Server starting at http://localhost:${port}`);
app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);

  await connectDB();
  await connectRedis();
});
