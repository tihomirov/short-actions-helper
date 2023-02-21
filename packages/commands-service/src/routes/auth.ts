import { Router } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserModel, User } from '../models/user';

export const authRouter = Router();

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, cb) => {
      const user = await UserModel.findOne<User>({ email });
      if (!user) {
        return cb(new Error('User with this email is not found'));
      }

      const validate = await bcrypt.compare(password, user.password);
      if (!validate) {
        return cb(new Error('Wrong password'));
      }

      return cb(null, user);
    },
  ),
);

passport.serializeUser((user: Express.User, cb) => {
  process.nextTick(() => {
    const { _id, email } = user as { _id: string; email: string };
    cb(null, { _id, email });
  });
});

passport.deserializeUser((user, cb) => process.nextTick(() => cb(null, user as User)));

authRouter.post('/register', async (req, res) => {
  try {
    const { password, email } = req.body as { password: string; email: string };
    // TODO: validate request
    if (!password || !email) {
      throw new Error('Email or Password is not presented in request');
    }

    const userWithProvidedEmail = await UserModel.findOne({ email });
    if (userWithProvidedEmail) {
      return res.status(401).json('User with this email is already exist');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      email,
      password: hashedPass,
    });
    const savedUser = await newUser.save();

    return req.login(savedUser, (error) => {
      if (error) {
        return res.status(500).json(error);
      }

      return res.status(200).json(savedUser);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

authRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', (error: unknown, user: User, info: unknown) => {
    if (error) {
      return res.status(500).json(error);
    }

    // user will be set to false, if not authenticated
    if (!user) {
      res.status(401).json(info); //info contains the error message
    }

    return req.logIn(user, (loginError) => {
      if (loginError) {
        return res.status(500).json(loginError);
      }

      return res.status(200).json(user);
    });
  })(req, res, next);
});

authRouter.post('/logout', (req, res) =>
  req.logout((error) => {
    if (error) {
      return res.status(500).json(error);
    }

    return res.status(200).json(null);
  }),
);

authRouter.get('/current-user', async (req, res) => {
  try {
    return res.status(200).json(req.user || null);
  } catch (error) {
    return res.status(500).json(error);
  }
});
