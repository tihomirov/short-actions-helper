import { Response, unwrap } from 'remote-shortcuts-common/src/utils';

import { SupportedAction } from '../../../common';

export abstract class Action<TSuccessResponse = undefined> {
  constructor(protected readonly _action: SupportedAction, protected readonly _tab: browser.tabs.Tab) {}

  abstract before(): Promise<void>;

  abstract run(): Promise<Response<TSuccessResponse>>;

  abstract after(): Promise<void>;

  protected get tabId(): number {
    return unwrap(this._tab?.id, 'tabId id must be defined to reload current tab');
  }
}
