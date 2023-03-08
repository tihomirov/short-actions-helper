import browser from 'webextension-polyfill';

import { assertExists, Response, TabMessage, TabMessageEvent, TabMessageResponse } from '../../../common';

export type BrowserTab = browser.Tabs.Tab;

export class TabsService {
  static async getCurrentTab(): Promise<BrowserTab> {
    const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });

    return tab;
  }

  static async removeTab(tabId: number): Promise<void> {
    await browser.tabs.remove(tabId);
  }

  static async reloadTab(tabId: number): Promise<void> {
    await browser.tabs.reload(tabId);
  }

  static async updateTab(tabId: number, update: browser.Tabs.UpdateUpdatePropertiesType): Promise<BrowserTab> {
    return await browser.tabs.update(tabId, update);
  }

  static async sendMessageToCurrentTab<T extends TabMessageEvent>(
    message: TabMessage,
  ): Promise<Response<TabMessageResponse[T], string>> {
    const { id } = await TabsService.getCurrentTab();
    assertExists(id, 'currentTab id must be defined to send message');

    return await TabsService.sendMessageToTab(id, message);
  }

  static async sendMessageToTab<T extends TabMessageEvent>(
    tabId: number,
    message: TabMessage,
  ): Promise<Response<TabMessageResponse[T], string>> {
    return await browser.tabs.sendMessage(tabId, message);
  }
}