import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { TabAction } from '../../../common';
import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

export class DecreaseZoomAction extends Action<TabAction> {
  before() {
    return Promise.resolve();
  }

  async run() {
    await this.decreaseZoom();
    return ResponseFactory.success(undefined);
  }

  after() {
    return Promise.resolve();
  }

  private async decreaseZoom(): Promise<void> {
    TabsService.decreaseZoomTab(this.tabId);
  }
}
