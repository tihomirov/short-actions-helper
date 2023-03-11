import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

export class ToggleMuteTabAction extends Action {
  before(): Promise<void> {
    return Promise.resolve();
  }

  run(): Promise<void> {
    return this.toggleMute();
  }

  after(): Promise<void> {
    return Promise.resolve();
  }

  private async toggleMute(): Promise<void> {
    await TabsService.updateTab(this.tabId, { muted: !this._tab?.mutedInfo?.muted });
  }
}
