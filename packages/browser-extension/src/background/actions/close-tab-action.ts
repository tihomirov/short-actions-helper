import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { TabAction } from '../../common';
import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

export class CloseTabAction extends Action<TabAction> {
  before() {
    return Promise.resolve();
  }

  async run() {
    await this.removeTab();
    return ResponseFactory.success(undefined);
  }

  after() {
    return Promise.resolve();
  }

  private async removeTab(): Promise<void> {
    return TabsService.removeTab(this.tabId);
  }
}
