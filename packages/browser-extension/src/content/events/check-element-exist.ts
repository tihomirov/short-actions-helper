import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { CheckElementExistMessage, TabMessageEvent, TabMessageResponse } from '../../common';
import { queryElement } from '../utils';
import { MessageEvent } from './event';

export class CheckElementExistEvent extends MessageEvent<
  CheckElementExistMessage,
  TabMessageResponse[TabMessageEvent.CheckElementExist]
> {
  run() {
    const element = queryElement(this._message.elementData);

    return ResponseFactory.success(!!element);
  }
}
