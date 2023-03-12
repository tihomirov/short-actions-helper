import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

export class ToggleMuteTabAction extends Action {
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
    await TabsService.updateTab(this.tabId, { muted: !this._tab?.mutedInfo?.muted });
  }
}
