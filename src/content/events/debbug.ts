import { Response, ResponseFactory, DebbugTabMessage } from '../../common';
import { MessageEvent } from './event';

export class DebbugEvent extends MessageEvent<DebbugTabMessage> {
  run(): Response<undefined> {
    console.log('Debbug Event Log', this._message);
    return ResponseFactory.success(undefined);
  }
}
