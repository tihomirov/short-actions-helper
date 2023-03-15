import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

export class DecreaseZoomAction extends Action {
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
