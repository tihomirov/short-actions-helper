import { DebbugMessage, Response, ResponseFactory } from '../../common';
import { MessageEvent } from './event';

export class DebbugEvent extends MessageEvent<DebbugMessage> {
  run(): Response<undefined, string> {
    console.log('Debbug Event Log', this._message);
    return ResponseFactory.success(undefined);
  }
}
