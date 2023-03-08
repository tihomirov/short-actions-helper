import { NextFunction, Request, Response } from 'express';

import { AppError } from '../utils';

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return next(new AppError(`Invalid token or session has expired`, 401));
    }

    next();
  } catch (err: unknown) {
    next(err);
  }
};
