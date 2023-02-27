import hexoid from 'hexoid';
import browser from 'webextension-polyfill';

import { ElementData } from '../../../common';
import { Command, Commands, PendingCommandForm } from '../types';

enum StorageKey {
  Commands = 'commands',
  PendingCommand = 'pendingCommand',
  InterceptedElement = 'interceptedElement',
}

export interface IStorageService {
  getCommands(): Promise<Commands>;
  getCommandsByHostname(hostname: string): Promise<Commands>;
  getCommandById(id: string): Promise<Command | undefined>;
  createCommand(command: Omit<Command, 'id'>): Promise<Command>;
  updateCommand(id: string, command: Omit<Command, 'id'>): Promise<Command | undefined>;
  deleteCommand(id: string): Promise<void>;
  getPendingCommand(): Promise<PendingCommandForm | undefined>;
  savePendingCommand(command: PendingCommandForm): Promise<PendingCommandForm>;
  removePendingCommand(): Promise<void>;
  getInterceptedElement(): Promise<ElementData | undefined>;
  removeInterceptedElement(): Promise<void>;
}

const getCommandId = hexoid();

class BrowserStorageService implements IStorageService {
  async getCommands(): Promise<Commands> {
    const { commands = [] } = await browser.storage.sync.get(StorageKey.Commands);
    return commands.filter((command: Command) => !command.hostname);
  }
  async getCommandsByHostname(hostname: string): Promise<Commands> {
    const { commands = [] } = await browser.storage.sync.get(StorageKey.Commands);
    return commands.filter((command: Command) => command.hostname === hostname);
  }

  async getCommandById(id: string): Promise<Command | undefined> {
    const { commands = [] } = await browser.storage.sync.get(StorageKey.Commands);
    return commands.find((command: Command) => command.id === id);
  }

  async createCommand(command: Omit<Command, 'id'>): Promise<Command> {
    const { commands = [] } = await browser.storage.sync.get(StorageKey.Commands);
    const newCommand = {
      id: getCommandId(),
      ...command,
    };

    commands.push(newCommand);
    await browser.storage.sync.set({ [StorageKey.Commands]: commands });

    return newCommand;
  }

  async updateCommand(id: string, command: Omit<Command, 'id'>): Promise<Command | undefined> {
    const { commands = [] } = await browser.storage.sync.get(StorageKey.Commands);

    const foundIndex = commands.findIndex((c: Command) => c.id == id);

    if (foundIndex === undefined) {
      return undefined;
    }

    commands[foundIndex] = {
      id,
      ...command,
    };

    await browser.storage.sync.set({ [StorageKey.Commands]: commands });

    return commands[foundIndex];
  }

  async deleteCommand(id: string): Promise<void> {
    const { commands = [] } = await browser.storage.sync.get(StorageKey.Commands);
    const filteredCommands = commands.filter((command: Command) => command.id !== id);

    await browser.storage.sync.set({ [StorageKey.Commands]: filteredCommands });
  }

  async getPendingCommand(): Promise<PendingCommandForm | undefined> {
    const { pendingCommand } = await browser.storage.sync.get(StorageKey.PendingCommand);
    return pendingCommand;
  }

  async savePendingCommand(command: PendingCommandForm): Promise<PendingCommandForm> {
    await browser.storage.sync.set({ [StorageKey.PendingCommand]: command });
    return command;
  }

  async removePendingCommand(): Promise<void> {
    await browser.storage.sync.remove(StorageKey.PendingCommand);
  }

  async getInterceptedElement(): Promise<ElementData | undefined> {
    const { interceptedElement } = await browser.storage.sync.get(StorageKey.InterceptedElement);
    return interceptedElement;
  }

  async removeInterceptedElement(): Promise<void> {
    await browser.storage.sync.remove(StorageKey.InterceptedElement);
  }
}

export const browserStorageService = new BrowserStorageService();
