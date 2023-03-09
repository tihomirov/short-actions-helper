import { CookieOptions, NextFunction, Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { createUser, findUser, signToken } from '../services';
import { AppError } from '../utils';

// Exclude this fields from the response
export const excludedFields = ['password'];

const accessTokenExpiresIn = +(process.env.ACCESS_TOKEN_EXPIRES_IN ?? 30);

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + accessTokenExpiresIn * 60 * 1000),
  maxAge: accessTokenExpiresIn * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

// Only set secure to true in production
if (process.env.NODE_ENV === 'production') {
  accessTokenCookieOptions.secure = true;
}

export const registerHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUser({
      email: req.body.email,
      password: req.body.password,
    });

    return res.status(201).json(ResponseFactory.success({ user }));
  } catch (err: unknown) {
    if (err instanceof MongoError && err?.code === 11000) {
      const message = 'Email already exist';
      return res.status(409).json(ResponseFactory.fail({ message }));
    }

    return next(err);
  }
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the user from the collection
    const user = await findUser({ email: req.body.email });

    // Check if user exist and password is correct
    if (!user || !(await user.comparePasswords(user.password, req.body.password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Create an Access Token
    const { accessToken } = await signToken(user);

    // Send Access Token in Cookie
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('loggedIn', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send Access Token
    return res.status(200).json(ResponseFactory.success({ accessToken }));
  } catch (err: unknown) {
    return next(err);
  }
};

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;

    res.clearCookie('accessToken');
    res.clearCookie('loggedIn');
    res.removeHeader('authorization');

    return res.status(200).json(ResponseFactory.success({ user }));
  } catch (err: unknown) {
    return next(err);
  }
};
