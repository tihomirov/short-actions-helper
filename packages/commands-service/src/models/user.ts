import { InferSchemaType, model, Schema } from 'mongoose';

const userSchema = new Schema(
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

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = model<User>('User', userSchema);
