import { TabMessageEvent, ResponseFactory } from '../../../common';
import { tabsService } from '../services';

export class MessageChannelStore {
  async runInterceptElementMode(): Promise<void> {
    const response = await tabsService.sendMessageToCurrentTab<TabMessageEvent.InterceptElement>({
      event: TabMessageEvent.InterceptElement,
    });

    if (ResponseFactory.isSuccess(response)) {
      window.close();
    } else {
      throw new Error(`Message Error: ${response.data}`);
    }
  }
}
