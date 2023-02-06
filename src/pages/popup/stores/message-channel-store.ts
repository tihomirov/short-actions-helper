import { TabEvent, TabAction } from '../../../common';
import { tabsService } from '../services';
import { Command } from '../types';

export class MessageChannelStore {
  async runInterceptElementMode(): Promise<unknown> {
    const response = await tabsService.sendMessageToCurrentTab({
      event: TabEvent.InterceptElement,
    });

    return response;
  }

  async runCommand(command: Command): Promise<unknown> {
    const { actions } = command;
    const responses: unknown[] = [];

    for (const action of actions) {
      const response = await this.runAction(action);
      responses.push(response);
    }

    return responses;
  }

  private async runAction(action: TabAction): Promise<unknown> {
    const response = await tabsService.sendMessageToCurrentTab({
      event: TabEvent.RunAction,
      action,
    });

    return response;
  }
}
