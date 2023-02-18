import { TabsService } from '../services/tabs';
import { Action } from './actions';

export class ToggleMuteTabAction extends Action {
  run(): Promise<void> {
    return this.toggleMute();
  }

  private async toggleMute(): Promise<void> {
    await TabsService.updateTab(this.tabId, { muted: !this._tab?.mutedInfo?.muted });
  }
}
