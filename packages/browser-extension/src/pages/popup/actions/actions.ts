import { SupportedAction, unwrap, TabMessageResponse, Response, TabMessageEvent } from '../../../common';

export type RunActionMessageResponse = Response<TabMessageResponse[TabMessageEvent.RunAction], string>;

export abstract class Action {
  constructor(protected readonly _action: SupportedAction, protected readonly _tab: browser.tabs.Tab) {}

  abstract run(): Promise<RunActionMessageResponse | void>;

  protected get tabId(): number {
    return unwrap(this._tab?.id, 'tabId id must be defined to reload current tab');
  }
}
