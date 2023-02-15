import { TabEvent, DocumentContentAction, ResponseFactory, Response, TabMessageResponse } from '../../../common';
import { tabsService } from '../services';
import { Command } from '../types';

type RunActionMessageResponse = Response<TabMessageResponse[TabEvent.RunAction]>;

export class MessageChannelStore {
  async runInterceptElementMode(): Promise<void> {
    const response = await tabsService.sendMessageToCurrentTab<TabEvent.InterceptElement>({
      event: TabEvent.InterceptElement,
    });

    if (ResponseFactory.isSuccess(response)) {
      window.close();
    } else {
      throw new Error(`Message Error: ${response.data}`);
    }
  }

  async runCommand(command: Command): Promise<void> {
    const { actions } = command;
    const responses: Array<RunActionMessageResponse> = [];

    for (const action of actions) {
      const response = await this.runAction(action);
      responses.push(response);
    }

    const failResponse = responses.find(ResponseFactory.isFail);

    if (failResponse) {
      throw new Error(`Message Error: ${failResponse.data}`);
    }
  }

  private async runAction(action: DocumentContentAction): Promise<RunActionMessageResponse> {
    return await tabsService.sendMessageToCurrentTab<TabEvent.RunAction>({
      event: TabEvent.RunAction,
      action,
    });
  }
}
