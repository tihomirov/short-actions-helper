import {
  DocumentContentAction as DocumentContentActionType,
  TabMessageEvent,
  RunDocumentContentActionMessage,
} from '../../../common';
import { TabsService } from '../services/tabs';
import { Action, RunActionMessageResponse } from './actions';

export class DocumentContentAction extends Action {
  run(): Promise<RunActionMessageResponse> {
    return this.sendMessageToCurrentTab();
  }

  private async sendMessageToCurrentTab(): Promise<RunActionMessageResponse> {
    const message: RunDocumentContentActionMessage = {
      event: TabMessageEvent.RunAction,
      action: this._action as DocumentContentActionType,
    };

    return await TabsService.sendMessageToTab(this.tabId, message);
  }
}
