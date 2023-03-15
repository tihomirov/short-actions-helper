import { Response, ResponseFactory } from 'remote-shortcuts-common/src/utils';

import {
  CheckElementExistMessage,
  DocumentContentAction as DocumentContentActionType,
  RunDocumentContentActionMessage,
  TabMessageEvent,
} from '../../../common';
import { TabsService } from '../services/tabs-service';
import { Action } from './actions';

const CHECK_ELEMENT_EXIST_TIMEOUT = 200;
const MAX_CHECK_ELEMENT_EXIST_ITERATIONS = 25;

export class DocumentContentAction extends Action<DocumentContentActionType> {
  async before() {
    const elementExist = await this.checkElementExist();

    if (elementExist) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      let iteration = 0;
      const intervalId = window.setInterval(async () => {
        const elementExist = await this.checkElementExist();

        if (elementExist) {
          window.clearInterval(intervalId);
          resolve();
        }

        if (iteration > MAX_CHECK_ELEMENT_EXIST_ITERATIONS) {
          window.clearInterval(intervalId);
          reject('Element is not found');
        }

        iteration++;
      }, CHECK_ELEMENT_EXIST_TIMEOUT);
    });
  }

  async run() {
    return await this.runAction();
  }

  after() {
    return Promise.resolve();
  }

  private async runAction(): Promise<Response<undefined>> {
    const message: RunDocumentContentActionMessage = {
      event: TabMessageEvent.RunAction,
      action: this._action,
    };

    return await TabsService.sendMessageToTab<TabMessageEvent.RunAction>(this.tabId, message);
  }

  private async checkElementExist(): Promise<boolean> {
    const message: CheckElementExistMessage = {
      event: TabMessageEvent.CheckElementExist,
      elementData: this._action.elementData,
    };

    const response = await TabsService.sendMessageToTab<TabMessageEvent.CheckElementExist>(this.tabId, message);

    return ResponseFactory.isSuccess(response) && response.data;
  }
}
