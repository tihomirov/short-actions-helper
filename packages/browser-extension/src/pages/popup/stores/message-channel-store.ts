import { ResponseFactory, TabMessageEvent } from '../../../common';
import { TabsService } from '../services';

export class MessageChannelStore {
  async runInterceptElementMode(): Promise<void> {
    const response = await TabsService.sendMessageToCurrentTab<TabMessageEvent.InterceptElement>({
      event: TabMessageEvent.InterceptElement,
    });

    if (ResponseFactory.isSuccess(response)) {
      window.close();
    } else {
      throw new Error(`Message Error: ${response.data}`);
    }
  }
}
