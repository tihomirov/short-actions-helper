import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

export class ReloadTabAction extends Action {
  run(): Promise<void> {
    return this.toggleMute();
  }

  private async toggleMute(): Promise<void> {
    return await TabsService.reloadTab(this.tabId);
  }
}
