import { Router } from 'express';

import { deleteCommand, getCommandById, getUserCommands, postCommand, putCommand } from '../controllers';
import { deserializeUser, requireUser } from '../middleware';

export const commandRouter = Router();

commandRouter.use(deserializeUser, requireUser);

commandRouter.get('/', getUserCommands);
commandRouter.get('/:id', getCommandById);
commandRouter.post('/', postCommand);
commandRouter.put('/:id', putCommand);
commandRouter.delete('/:id', deleteCommand);
