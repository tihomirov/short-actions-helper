import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

export class IncreaseZoomAction extends Action {
  before() {
    return Promise.resolve();
  }

  async run() {
    await this.increaseZoom();
    return ResponseFactory.success(undefined);
  }

  after() {
    return Promise.resolve();
  }

  private async increaseZoom(): Promise<void> {
    TabsService.increaseZoomTab(this.tabId);
  }
}
