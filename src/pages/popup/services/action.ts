import { Action } from '../../../common'
import { tabsService } from './tabs'

class ActionService {
  runActions = async (actions: ReadonlyArray<Action>) => {
    for (const action of actions) {
      await this.runAction(action);
    }
  }

  private async runAction(action: Action) {
    console.log('Run Actions', action);
    await tabsService.sendElementAction(action);
  }
}

export const actionService = new ActionService();
