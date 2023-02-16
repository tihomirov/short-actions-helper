import { assertExists, TabMessageEvent, TabMessage, TabMessageResponse, Response } from '../../../common';

export type BrowserTab = chrome.tabs.Tab;

class TabsService {
  private _currentTab: BrowserTab | undefined = undefined;

  async sendMessageToCurrentTab<T extends TabMessageEvent>(
    message: TabMessage,
  ): Promise<Response<TabMessageResponse[T]>> {
    const tabId = this._currentTab?.id;
    assertExists(tabId, 'currentTab id must be defined to send message');

    const response = await chrome.tabs.sendMessage<TabMessage, Response<TabMessageResponse[T]>>(tabId, message);

    return response;
  }

  async gueryCurrentTab(): Promise<BrowserTab | undefined> {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);

    this._currentTab = tab;

    return tab;
  }

  async reloadCurrentTab(): Promise<void> {
    const tabId = this._currentTab?.id;
    assertExists(tabId, 'currentTab id must be defined to reload current tab');
    await chrome.tabs.reload(tabId);
  }

  async closeCurrentTab(): Promise<void> {
    const tabId = this._currentTab?.id;
    assertExists(tabId, 'currentTab id must be defined to reload current tab');
    await chrome.tabs.remove(tabId);
  }

  async toggleMuteCurrentTab(): Promise<void> {
    const tabId = this._currentTab?.id;
    assertExists(tabId, 'currentTab id must be defined to reload current tab');
    this._currentTab = await chrome.tabs.update(tabId, { muted: !this._currentTab?.mutedInfo?.muted });
  }
}

export const tabsService = new TabsService();
