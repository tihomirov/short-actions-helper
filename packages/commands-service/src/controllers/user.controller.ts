import { NextFunction, Request, Response } from 'express';

import { findAllUsers } from '../services';

export const getCurrentUserHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;

    return res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: unknown) {
    return next(err);
  }
};

export const getAllUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await findAllUsers();

    return res.status(200).json({
      status: 'success',
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err: unknown) {
    return next(err);
  }
};
