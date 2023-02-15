import hexoid from 'hexoid';
import { Commands, Command, PendingCommandForm } from '../types';
import { ElementData } from '../../../common';

enum StorageKey {
  Commands = 'commands',
  PendingCommand = 'pendingCommand',
  InterceptedElement = 'interceptedElement',
}

export interface IStorageService {
  getCommands(): Promise<Commands>;
  getCommandsByHostname(hostname: string): Promise<Commands>;
  createCommand(command: Omit<Command, 'id'>): Promise<Command>;
  deleteCommand(id: string, hostname?: string): Promise<Commands>;
  getPendingCommand(): Promise<PendingCommandForm | undefined>;
  savePendingCommand(command: PendingCommandForm): Promise<PendingCommandForm>;
  removePendingCommand(): Promise<void>;
  getInterceptedElement(): Promise<ElementData | undefined>;
  removeInterceptedElement(): Promise<void>;
}

const getCommandId = hexoid();

class BrowserStorageService implements IStorageService {
  async getCommands(): Promise<Commands> {
    const { commands = [] } = await chrome.storage.sync.get(StorageKey.Commands);
    return commands.filter((command: Command) => !command.hostname);
  }
  async getCommandsByHostname(hostname?: string): Promise<Commands> {
    const { commands = [] } = await chrome.storage.sync.get(StorageKey.Commands);
    return commands.filter((command: Command) => command.hostname === hostname);
  }

  async createCommand(command: Omit<Command, 'id'>): Promise<Command> {
    const { commands = [] } = await chrome.storage.sync.get(StorageKey.Commands);
    const newCommand = {
      id: getCommandId(),
      ...command,
    };

    commands.push(newCommand);
    await chrome.storage.sync.set({ [StorageKey.Commands]: commands });

    return newCommand;
  }

  async deleteCommand(id: string, hostname?: string): Promise<Commands> {
    const { commands = [] } = await chrome.storage.sync.get(StorageKey.Commands);
    const filteredCommands = commands.filter((command: Command) => command.id !== id);

    await chrome.storage.sync.set({ [StorageKey.Commands]: filteredCommands });

    if (hostname) {
      return filteredCommands.filter((command: Command) => command.hostname === hostname);
    } else {
      return filteredCommands.filter((command: Command) => !command.hostname);
    }
  }

  async getPendingCommand(): Promise<PendingCommandForm | undefined> {
    const { pendingCommand } = await chrome.storage.sync.get(StorageKey.PendingCommand);
    return pendingCommand;
  }

  async savePendingCommand(command: PendingCommandForm): Promise<PendingCommandForm> {
    await chrome.storage.sync.set({ [StorageKey.PendingCommand]: command });
    return command;
  }

  async removePendingCommand(): Promise<void> {
    await chrome.storage.sync.remove(StorageKey.PendingCommand);
  }

  async getInterceptedElement(): Promise<ElementData | undefined> {
    const { interceptedElement } = await chrome.storage.sync.get(StorageKey.InterceptedElement);
    return interceptedElement;
  }

  async removeInterceptedElement(): Promise<void> {
    await chrome.storage.sync.remove(StorageKey.InterceptedElement);
  }
}

export const browserStorageService = new BrowserStorageService();