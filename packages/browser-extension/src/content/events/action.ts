import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { ElementEvent, RunDocumentContentActionMessage, TabMessageEvent, TabMessageResponse } from '../../common';
import { queryElement } from '../utils';
import { MessageEvent } from './event';

const elementActionsMethods: Record<ElementEvent, (element: HTMLElement) => void> = {
  [ElementEvent.Click]: (element) => element.click(),
  [ElementEvent.Focus]: (element) => element.focus(),
};

export class ActionEvent extends MessageEvent<
  RunDocumentContentActionMessage,
  TabMessageResponse[TabMessageEvent.RunAction]
> {
  run() {
    const { elementEvent } = this._message.action;
    const element = queryElement(this._message.action.elementData);

    if (element) {
      elementActionsMethods[elementEvent](element);
      return ResponseFactory.success(undefined);
    } else {
      return ResponseFactory.fail({
        message: 'Element is not found',
      });
    }
  }
}
