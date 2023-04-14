import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { SetZoomTabAction } from '../../common';
import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

export class SetZoomAction extends Action<SetZoomTabAction> {
  before() {
    return Promise.resolve();
  }

  async run() {
    await this.setZoom();
    return ResponseFactory.success(undefined);
  }

  after() {
    return Promise.resolve();
  }

  private async setZoom(): Promise<void> {
    TabsService.setZoomTab(this.tabId, +this._action.value / 100);
  }
}
