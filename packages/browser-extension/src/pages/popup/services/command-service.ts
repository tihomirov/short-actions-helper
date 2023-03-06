import { Response, ResponseFactory } from '../../../common';
import { Command, Commands, PendingCommandForm } from '../types';
import { browserStorageService, IStorageService } from './browser-storage-service';
import { API_URL, headers } from './constants';

class CommandService {
  constructor(private readonly _storageService: IStorageService) {}

  async getCommands(hostname?: string): Promise<Commands> {
    const response = await fetch(`${API_URL}/command?hostname=${hostname ?? ''}`);
    return await response.json();
  }

  async getCommandById(id: string): Promise<Command | undefined> {
    const response = await fetch(`${API_URL}/command/${id}`);
    return await response.json();
  }

  async createCommand(command: Omit<Command, '_id'>): Promise<Response<undefined, string>> {
    const response = await fetch(`${API_URL}/command`, {
      method: 'POST',
      headers,
      body: JSON.stringify(command),
    });
    const data = await response.json();

    if (response.status === 200) {
      return ResponseFactory.success(undefined);
    } else {
      return ResponseFactory.fail(data.toString());
    }
  }

  async updateCommand(command: Command): Promise<Response<undefined, string>> {
    const response = await fetch(`${API_URL}/command/${command._id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(command),
    });
    const data = await response.json();

    if (response.status === 200) {
      return ResponseFactory.success(undefined);
    } else {
      return ResponseFactory.fail(data.toString());
    }
  }

  async deleteCommand(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/command/${id}`, {
      method: 'DELETE',
      headers,
    });
    return await response.json();
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
