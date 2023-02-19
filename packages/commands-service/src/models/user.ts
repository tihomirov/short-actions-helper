import { Schema, model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 16,
    },
  },

  { timestamps: true },
);

export const User = model<IUser>('User', userSchema);
