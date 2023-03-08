import { assertUnreachable } from 'remote-shortcuts-common/src/utils';

import { ActionType, SupportedAction, TabAction, TabEventType } from '../../../common';
import { Action } from './actions';
import { CloseTabAction } from './close-tab-action';
import { DocumentContentAction } from './document-content-action';
import { ReloadTabAction } from './reload-tab-action';
import { ToggleMuteTabAction } from './toggle-mute-tab-action';

export function createAction(action: SupportedAction, tab: browser.tabs.Tab): Action {
  const type = action.type;

  switch (type) {
    case ActionType.DocumentContentAction: {
      return new DocumentContentAction(action, tab);
    }
    case ActionType.TabAction: {
      return createTabAction(action, tab);
    }
    default:
      assertUnreachable(type);
  }
}

export function createTabAction(action: TabAction, tab: browser.tabs.Tab): Action {
  const type = action.tabEvent;

  switch (type) {
    case TabEventType.Close: {
      return new CloseTabAction(action, tab);
    }
    case TabEventType.Reload: {
      return new ReloadTabAction(action, tab);
    }
    case TabEventType.ToggleMute: {
      return new ToggleMuteTabAction(action, tab);
    }
    default: {
      assertUnreachable(type);
    }
  }
}
