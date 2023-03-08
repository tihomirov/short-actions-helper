import { NextFunction, Request, Response } from 'express';

import { createCommand, findCommandById, findUserCommands, removeCommand, updateCommand } from '../services';

export const getUserCommands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    const hostname = req.query.hostname?.toString();
    const commands = await findUserCommands(user._id, hostname);

    return res.status(200).json({
      status: 'success',
      result: commands.length,
      data: {
        commands,
      },
    });
  } catch (err: unknown) {
    return next(err);
  }
};

export const getCommandById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    const command = await findCommandById(user._id, req.params.id);

    return res.status(200).json({
      status: 'success',
      data: {
        command,
      },
    });
  } catch (err: unknown) {
    return next(err);
  }
};

export const postCommand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    const command = await createCommand({
      createdUserId: user._id,
      ...req.body,
    });

    return res.status(200).json({
      status: 'success',
      data: {
        command,
      },
    });
  } catch (err: unknown) {
    return next(err);
  }
};

export const putCommand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    const command = updateCommand(user._id, req.body);

    return res.status(200).json({
      status: 'success',
      data: {
        command,
      },
    });
  } catch (err: unknown) {
    return next(err);
  }
};

export const deleteCommand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    const command = removeCommand(user._id, req.params.id);

    return res.status(200).json({
      status: 'success',
      data: {
        command,
      },
    });
  } catch (err: unknown) {
    return next(err);
  }
};
