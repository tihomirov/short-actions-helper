import { Response, ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { SupportedAction } from '../../common';
import { createAction } from '../actions';
import { TabsService } from './tabs-service';

export class ActionRunner {
  async runAction(action: SupportedAction): Promise<Response<unknown>> {
    const currentTab = await TabsService.getCurrentTab();
    const actionInstanse = createAction(action, currentTab);

    await actionInstanse.before();
    const response = await actionInstanse.run();
    await actionInstanse.after();

    return response || ResponseFactory.success(undefined);
  }
}
