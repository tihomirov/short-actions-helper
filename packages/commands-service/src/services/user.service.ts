import { DocumentType } from '@typegoose/typegoose';
import { omit } from 'lodash';
import { FilterQuery, QueryOptions } from 'mongoose';

import { excludedFields } from '../controllers';
import { User, userModel } from '../models';
import { redisClient, signJwt } from '../utils';

export const createUser = async (input: Partial<User>) => {
  const user = await userModel.create(input);
  return omit(user.toJSON(), excludedFields);
};

export const findUserById = async (id: string) => {
  const user = await userModel.findById(id).lean();
  return omit(user, excludedFields);
};

export const findAllUsers = async () => {
  return await userModel.find();
};

export const findUser = async (query: FilterQuery<User>, options: QueryOptions = {}) => {
  return await userModel.findOne(query, {}, options).select('+password');
};

export const signToken = async (user: DocumentType<User>) => {
  // Sign the access token
  const accessToken = signJwt(
    {
      sub: user._id,
    },
    {
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN ?? 30}m`,
    },
  );

  const userId = user._id.toString();

  // Create a Session
  await redisClient.set(userId, JSON.stringify(user), { EX: 60 * 60 });

  // Return access token
  return { accessToken };
};
