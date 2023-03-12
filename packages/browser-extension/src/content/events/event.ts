import { Response } from 'remote-shortcuts-common/src/utils';

import { TabMessage, TabMessageEvent, TabMessageResponse } from '../../common';

export abstract class MessageEvent<T extends TabMessage, K extends TabMessageResponse[TabMessageEvent]> {
  constructor(protected readonly _message: T) {}
  abstract run(): Response<K>;
}
