import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

export class CloseTabAction extends Action {
  before(): Promise<void> {
    return Promise.resolve();
  }

  run(): Promise<void> {
    return this.removeTab();
  }

  after(): Promise<void> {
    return Promise.resolve();
  }

  private async removeTab(): Promise<void> {
    TabsService.removeTab(this.tabId);
  }
}
