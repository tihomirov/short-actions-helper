import browser from 'webextension-polyfill';

import { PendingCommandForm, StorageKey } from '../../../common';

class BrowserStorageService {
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
}

export const browserStorageService = new BrowserStorageService();
