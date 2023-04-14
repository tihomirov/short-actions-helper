import { Response, ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { Command } from '../../common';
import { ActionRunner } from './action-runner-service';

export class CommandRunnerService {
  constructor(private readonly _actionRunner: ActionRunner) {}

  async runCommand(command: Command): Promise<void> {
    const { actions } = command;
    const responses: Array<Response<unknown>> = [];

    for (const action of actions) {
      const response = await this._actionRunner.runAction(action);
      responses.push(response);
    }

    const failResponse = responses.find(ResponseFactory.isFail);

    if (failResponse) {
      throw new Error(`Message Error: ${failResponse.data}`);
    }
  }
}
