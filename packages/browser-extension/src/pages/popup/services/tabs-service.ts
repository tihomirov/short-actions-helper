import { Response } from 'remote-shortcuts-common/src/utils';
import { assertExists } from 'remote-shortcuts-common/src/utils';
import browser from 'webextension-polyfill';

import { TabMessage, TabMessageEvent, TabMessageResponse } from '../../../common';

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

  static async setZoomTab(tabId: number, zoomFactor: number): Promise<void> {
    await browser.tabs.setZoom(tabId, zoomFactor);
  }

  static async increaseZoomTab(tabId: number): Promise<void> {
    const zoom = await browser.tabs.getZoom(tabId);
    await browser.tabs.setZoom(tabId, zoom + 0.05);
  }

  static async decreaseZoomTab(tabId: number): Promise<void> {
    const zoom = await browser.tabs.getZoom(tabId);
    await browser.tabs.setZoom(tabId, zoom - 0.05);
  }

  static async updateTab(tabId: number, update: browser.Tabs.UpdateUpdatePropertiesType): Promise<BrowserTab> {
    return await browser.tabs.update(tabId, update);
  }

  static async sendMessageToCurrentTab<T extends TabMessageEvent>(
    message: TabMessage,
  ): Promise<Response<TabMessageResponse[T]>> {
    const { id } = await TabsService.getCurrentTab();
    assertExists(id, 'currentTab id must be defined to send message');

    return await TabsService.sendMessageToTab(id, message);
  }

  static async sendMessageToTab<T extends TabMessageEvent>(
    tabId: number,
    message: TabMessage,
  ): Promise<Response<TabMessageResponse[T]>> {
    return await browser.tabs.sendMessage(tabId, message);
  }
}
