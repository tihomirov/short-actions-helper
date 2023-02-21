import { SupportedAction, ResponseFactory, Response } from '../../../common';
import { createAction } from '../actions';
import { Command } from '../types';
import { TabsService } from './tabs';

class CommandRunnerService {
  async runCommand(command: Command): Promise<void> {
    const { actions } = command;
    const responses: Array<Response<unknown, string>> = [];

    for (const action of actions) {
      const response = await this.runAction(action);
      responses.push(response);
    }

    const failResponse = responses.find(ResponseFactory.isFail);

    if (failResponse) {
      throw new Error(`Message Error: ${failResponse.data}`);
    }
  }

  private async runAction(action: SupportedAction): Promise<Response<unknown, string>> {
    const currentTab = await TabsService.getCurrentTab();
    const actionInstanse = createAction(action, currentTab);
    const response = await actionInstanse.run();

    return response || ResponseFactory.success(undefined);
  }
}

export const commandRunnerService = new CommandRunnerService();
