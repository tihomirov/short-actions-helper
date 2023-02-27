import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

export class CloseTabAction extends Action {
  run(): Promise<void> {
    return this.removeTab();
  }

  private async removeTab(): Promise<void> {
    TabsService.removeTab(this.tabId);
  }
}
