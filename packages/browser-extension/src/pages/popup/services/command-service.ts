import { assertWithTypeguard, ResponseFactory, responseTypeguard } from 'remote-shortcuts-common/src/utils';

import { Command, Commands, PendingCommandForm } from '../types';
import { browserStorageService, IStorageService } from './browser-storage-service';
import { API_URL, headers } from './constants';
import { commandResponseTypeguard, commandsResponseTypeguard } from './typeguards';

class CommandService {
  constructor(private readonly _storageService: IStorageService) {}

  async getCommands(hostname?: string): Promise<Commands | string> {
    const response = await fetch(`${API_URL}/command?hostname=${hostname ?? ''}`).then((res) => res.json());

    assertWithTypeguard(response, responseTypeguard(commandsResponseTypeguard));

    return ResponseFactory.isSuccess(response) ? response.data.commands : response.data.message;
  }

  async getCommandById(id: string): Promise<Command | string> {
    const response = await fetch(`${API_URL}/command/${id}`).then((res) => res.json());

    assertWithTypeguard(response, responseTypeguard(commandResponseTypeguard));

    return ResponseFactory.isSuccess(response) ? response.data.command : response.data.message;
  }

  async createCommand(command: Omit<Command, '_id'>): Promise<Command | string> {
    const response = await fetch(`${API_URL}/command`, {
      method: 'POST',
      headers,
      body: JSON.stringify(command),
    }).then((res) => res.json());

    assertWithTypeguard(response, responseTypeguard(commandResponseTypeguard));

    return ResponseFactory.isSuccess(response) ? response.data.command : response.data.message;
  }

  async updateCommand(command: Command): Promise<undefined | string> {
    const response = await fetch(`${API_URL}/command/${command._id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(command),
    }).then((res) => res.json());

    assertWithTypeguard(response, responseTypeguard());

    return ResponseFactory.isSuccess(response) ? undefined : response.data.message;
  }

  async deleteCommand(id: string): Promise<undefined | string> {
    const response = await fetch(`${API_URL}/command/${id}`, {
      method: 'DELETE',
      headers,
    }).then((res) => res.json());

    assertWithTypeguard(response, responseTypeguard());

    return ResponseFactory.isSuccess(response) ? undefined : response.data.message;
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
