import { Router } from 'express';

import { CommandModel } from '../models/command';

export const commandRouter = Router();

commandRouter.post('/', async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(403).json('You need to login before creating Command');
    }

    const { _id: createdUserId } = currentUser as { _id: string };
    const command = new CommandModel({
      createdUserId,
      ...req.body,
    });
    const savedCommand = await command.save();

    return res.status(200).json(savedCommand);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//update post
commandRouter.put('/:id', async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(403).json('You need to login before updating Command');
    }

    const { _id: userId } = currentUser as { _id: string };
    const command = await CommandModel.findById(req.params.id);

    if (!command) {
      return res.status(500).json('Command to update is not found');
    }

    if (command.createdUserId.equals(userId)) {
      const updatedCommand = await CommandModel.updateOne({ $set: req.body });
      return res.status(200).json(updatedCommand);
    } else {
      return res.status(403).json('You can not update this Command');
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//delete post
commandRouter.delete('/:id', async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(403).json('You need to login before creating Command');
    }

    const command = await CommandModel.findById(req.params.id);
    const { _id: userId } = currentUser as { _id: string };

    if (!command) {
      return res.status(500).json('Command not found');
    }

    if (command.createdUserId.equals(userId)) {
      await command.delete();
      return res.status(200).json('the post is deleted');
    } else {
      return res.status(403).json('you can only delete your post');
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get All posts
commandRouter.get('/', async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(403).json('You need to login before fetching commands');
    }
    const { _id: createdUserId } = currentUser as { _id: string };
    const hostname = req.query.hostname;

    const commands = await CommandModel.find({
      createdUserId,
      hostname: {
        $in: [hostname, undefined],
      },
    });

    return res.status(200).json(commands);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get one post
commandRouter.get('/:id', async (req, res) => {
  try {
    const post = await CommandModel.findById(req.params.id);
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json(error);
  }
});
