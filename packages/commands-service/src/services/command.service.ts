import { Command, CommandModel } from '../models';
import { AppError } from '../utils';

export const findUserCommands = async (createdUserId: string, hostname?: string) => {
  return await CommandModel.find({
    createdUserId,
    hostname: hostname ? { $in: [hostname, undefined] } : undefined,
  });
};

export const findCommandById = async (userId: string, commandId: string) => {
  const command = await CommandModel.findById(commandId);

  if (!command) {
    throw new AppError('Command not Found', 404);
  }

  if (!command.createdUserId.equals(userId)) {
    throw new AppError('Command is not available', 403);
  }

  return command.toJSON();
};

export const createCommand = async (input: Partial<Command>) => {
  const command = await CommandModel.create(input);
  return command.toJSON();
};

export const updateCommand = async (userId: string, input: Partial<Command>) => {
  const command = await CommandModel.findOne({ $set: input });

  if (!command) {
    throw new AppError('Command not Found', 404);
  }

  if (!command.createdUserId.equals(userId)) {
    throw new AppError('Command can not e updated', 403);
  }

  command.update({ $set: input });
  return command.toJSON();
};

export const removeCommand = async (userId: string, commandId: string) => {
  const command = await CommandModel.findById(commandId);

  if (!command) {
    throw new AppError('Command not Found', 404);
  }

  if (!command.createdUserId.equals(userId)) {
    throw new AppError('Command can not be Deleted', 403);
  }

  return await command.delete();
};
