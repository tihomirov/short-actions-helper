import { TabEvent, Action } from '../../../common'

type BrowserTab = chrome.tabs.Tab;

class TabsService {
  private _currentTab: BrowserTab | undefined = undefined;

  async sendElementAction(action: Action): Promise<unknown> {
    const id = await this.getCurrentTabId();

    if (!id) {
      return;
    }

    const response = await chrome.tabs.sendMessage(id, {
      event: TabEvent.ElementAction,
      action,
    });

    return response;
  }

  async getCurrentTabHostname(): Promise<string | undefined> {
    console.log('!!! getCurrentTabHostname START');
    const tab = await this.getCurrentTab();
    console.log('!!! getCurrentTabHostname tab', tab);
    const url = tab?.url;

    console.log('!!! getCurrentTabHostname url', url);

    if (!url) {
      return undefined;
    }

    const { hostname } = new URL(url)

    return hostname;
  }

  async runInterceptElement(): Promise<'ok' | undefined> {
    const id = await this.getCurrentTabId();

    if (!id) {
      return;
    }

    const response = await chrome.tabs.sendMessage(id, {
      event: TabEvent.InterceptElement,
    });

    return response;
  }

  private async getCurrentTab(): Promise<BrowserTab | undefined> {
    if (!this._currentTab) {
      const queryOptions = { active: true, lastFocusedWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);

      this._currentTab = tab
    }

    return this._currentTab;
  }

  private async getCurrentTabId(): Promise<number | undefined> {
    const tab = await this.getCurrentTab();
    return tab?.id;
  }
}

export const tabsService = new TabsService();
