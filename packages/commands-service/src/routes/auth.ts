import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/user';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  try {
    const { password, email } = req.body as { password: string; email: string };
    // TODO: validate request
    if (!password || !email) {
      throw new Error('Email or Password is not presented in request');
    }

    const userWithProvidedEmail = await User.findOne({ email });
    if (userWithProvidedEmail) {
      return res.status(400).json('User with this email is already exist');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await new User({
      email,
      password: hashedPass,
    });
    const savedUser = await newUser.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = savedUser;

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json(error);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { password, email } = req.body;

    // TODO: validate request
    if (!password || !email) {
      throw new Error('Email or Password is not presented in request');
    }

    const user = await User.findOne<IUser>({ email });
    if (!user) {
      return res.status(400).json('User with this email is not found');
    }

    const validate = await bcrypt.compare(password, user.password);
    if (!validate) {
      return res.status(400).json('Wrong password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json(error);
  }
});
