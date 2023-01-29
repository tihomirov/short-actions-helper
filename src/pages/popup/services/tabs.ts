import {TabEvent, Action} from '../../../common'

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

  private async getCurrentTabId(): Promise<number | undefined> {
    const queryOptions = { active: true };
    const [tab] = await chrome.tabs.query(queryOptions);

    return tab?.id;
  }
}

export const tabsService = new TabsService();
