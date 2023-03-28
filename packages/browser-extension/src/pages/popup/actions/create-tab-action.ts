import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { CreateTabAction as CreateTabActionType } from '../../../common';
import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

export class CreateTabAction extends Action<CreateTabActionType> {
  before() {
    return Promise.resolve();
  }

  async run() {
    await this.createTab();
    return ResponseFactory.success(undefined);
  }

  after() {
    return Promise.resolve();
  }

  private async createTab(): Promise<void> {
    return TabsService.openTab(this._action.value);
  }
}
