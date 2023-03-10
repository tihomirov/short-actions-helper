import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { TabMessageEvent } from '../../../common';
import { TabsService } from '../services';

export class MessageChannelStore {
  async runInterceptElementMode(actionIndex: number): Promise<void> {
    const response = await TabsService.sendMessageToCurrentTab<TabMessageEvent.InterceptElement>({
      event: TabMessageEvent.InterceptElement,
      actionIndex,
    });

    if (ResponseFactory.isSuccess(response)) {
      window.close();
    } else {
      throw new Error(`Message Error: ${response.data}`);
    }
  }
}
