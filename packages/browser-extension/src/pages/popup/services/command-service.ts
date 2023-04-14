import { assertWithTypeguard, ResponseFactory, responseTypeguard } from 'remote-shortcuts-common/src/utils';

import { Command, Commands, PendingCommandForm } from '../../../common';
import { browserStorageService } from './browser-storage-service';
import { API_URL, headers } from './constants';
import { commandResponseTypeguard, commandsResponseTypeguard } from './typeguards';

class CommandService {
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
    return await browserStorageService.getPendingCommand();
  }

  async savePendingCommand(command: PendingCommandForm): Promise<void> {
    await browserStorageService.savePendingCommand(command);
  }

  async removePendingCommand(): Promise<void> {
    await browserStorageService.removePendingCommand();
  }
}

export const commandService = new CommandService();
