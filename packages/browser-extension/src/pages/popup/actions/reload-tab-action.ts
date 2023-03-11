import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

export class ReloadTabAction extends Action {
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
    return await TabsService.reloadTab(this.tabId);
  }
}
