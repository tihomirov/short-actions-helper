import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

const DEFAULT_ZOOM_VALUE = 1;

export class SetZoomAction extends Action {
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
    TabsService.setZoomTab(
      this.tabId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._action.value === undefined ? DEFAULT_ZOOM_VALUE : +this._action.value / 100,
    );
  }
}
