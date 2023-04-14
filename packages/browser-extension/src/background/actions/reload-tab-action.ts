import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { TabAction } from '../../common';
import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

export class ReloadTabAction extends Action<TabAction> {
  before() {
    return Promise.resolve();
  }

  async run() {
    await this.toggleMute();
    return ResponseFactory.success(undefined);
  }

  after() {
    return Promise.resolve();
  }

  private async toggleMute(): Promise<void> {
    return await TabsService.reloadTab(this.tabId);
  }
}
