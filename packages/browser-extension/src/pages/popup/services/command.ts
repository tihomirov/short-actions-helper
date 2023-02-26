import { Response, ResponseFactory } from '../../../common';
import { Command, Commands, PendingCommandForm } from '../types';
import { browserStorageService, IStorageService } from './browser-storage';

class CommandService {
  constructor(private readonly _storageService: IStorageService) {}

  async getCommands(): Promise<Commands> {
    return await this._storageService.getCommands();
  }

  async getCommandsByHostname(hostname: string): Promise<Commands> {
    return await this._storageService.getCommandsByHostname(hostname);
  }

  async createCommand(command: Omit<Command, 'id'>): Promise<Response<undefined, string>> {
    await this._storageService.createCommand(command);
    return ResponseFactory.success(undefined);
  }

  async deleteCommand(id: string): Promise<void> {
    await this._storageService.deleteCommand(id);
  }

  async getPendingCommand(): Promise<PendingCommandForm | undefined> {
    const pendingCommand = await this._storageService.getPendingCommand();
    const interceptedElement = await this._storageService.getInterceptedElement();

    // TODO: update intercepted element logic
    if (pendingCommand) {
      if (pendingCommand.actions.length === 0) {
        pendingCommand.actions.push({
          ...interceptedElement,
        });
      } else {
        const lastIndex = pendingCommand.actions.length - 1;
        pendingCommand.actions[lastIndex] = {
          ...pendingCommand.actions[lastIndex],
          ...interceptedElement,
        };
      }

      return pendingCommand;
    }

    return undefined;
  }

  async savePendingCommand(command: PendingCommandForm): Promise<void> {
    await this._storageService.savePendingCommand(command);
  }

  async removePendingCommand(): Promise<void> {
    await this._storageService.removeInterceptedElement();
    await this._storageService.removePendingCommand();
  }
}

export const commandService = new CommandService(browserStorageService);
