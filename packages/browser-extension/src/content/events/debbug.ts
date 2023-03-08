import { Response, ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { DebbugMessage } from '../../common';
import { MessageEvent } from './event';

export class DebbugEvent extends MessageEvent<DebbugMessage> {
  run(): Response<undefined, string> {
    console.log('Debbug Event Log', this._message);
    return ResponseFactory.success(undefined);
  }
}
