import { TabEvent, Action } from '../../../common'

class TabsService {
  async sendElementAction(action: Action): Promise<unknown> {
    const tab = await this.getCurrentTab();
    const id = tab?.id;

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
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    const url = tab?.url;

    if (!url) {
      return undefined;
    }

    const { hostname } = new URL(url)

    return hostname;
  }

  private async getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);

    return tab;
  }
}

export const tabsService = new TabsService();
