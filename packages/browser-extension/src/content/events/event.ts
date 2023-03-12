import { Response } from 'remote-shortcuts-common/src/utils';

import { TabMessage } from '../../common';

export abstract class MessageEvent<T = TabMessage, K = undefined> {
  constructor(protected readonly _message: T) {}
  abstract run(): Response<K>;
}
