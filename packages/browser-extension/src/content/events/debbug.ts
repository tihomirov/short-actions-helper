import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { DebbugMessage, TabMessageEvent, TabMessageResponse } from '../../common';
import { MessageEvent } from './event';

export class DebbugEvent extends MessageEvent<DebbugMessage, TabMessageResponse[TabMessageEvent.Debbug]> {
  run() {
    console.log('Debbug Event Log', this._message);
    return ResponseFactory.success(undefined);
  }
}
