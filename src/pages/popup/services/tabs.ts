import { TabMessage } from '../../../common';
import { assertExists } from '../../../utils';

export type BrowserTab = chrome.tabs.Tab;

class TabsService {
  private _currentTab: BrowserTab | undefined = undefined;

  // async sendElementAction(action: Action): Promise<unknown> {
  //   const id = await this.getCurrentTabId();

  //   if (!id) {
  //     return;
  //   }

  //   const response = await chrome.tabs.sendMessage(id, {
  //     event: TabEvent.RunAction,
  //     action,
  //   });

  //   return response;
  // }

  async sendMessageToCurrentTab(message: TabMessage): Promise<void> {
    const tabId = this._currentTab?.id;
    assertExists(tabId, 'currentTab id must be defined to send message');

    const response = await chrome.tabs.sendMessage<TabMessage>(tabId, message);

    return response;
  }

  // async runInterceptElement(): Promise<'ok' | undefined> {
  //   const id = await this.getCurrentTabId();

  //   if (!id) {
  //     return;
  //   }

  //   const response = await chrome.tabs.sendMessage(id, {
  //     event: TabEvent.InterceptElement,
  //   });

  //   return response;
  // }

  async gueryCurrentTab(): Promise<BrowserTab | undefined> {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);

    this._currentTab = tab;

    return tab;
  }
}

export const tabsService = new TabsService();
