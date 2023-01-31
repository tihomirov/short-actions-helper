import { TabEvent, Action } from '../../../common'

class TabsService {
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
    const tab = await this.getCurrentTab();
    const url = tab?.url;

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

  private async getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);

    return tab;
  }

  private async getCurrentTabId(): Promise<number | undefined> {
    const tab = await this.getCurrentTab();
    return tab?.id;
  }
}

export const tabsService = new TabsService();
