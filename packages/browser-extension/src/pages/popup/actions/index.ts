import { assertUnreachable } from 'remote-shortcuts-common/src/utils';

import {
  ActionType,
  CreateTabAction as CreateTabActionType,
  SetZoomTabAction,
  SupportedAction,
  TabAction,
  TabEventType,
} from '../../../common';
import { Action } from './actions';
import { CloseTabAction } from './close-tab-action';
import { CreateTabAction } from './create-tab-action';
import { DecreaseZoomAction } from './descrease-zoom-action';
import { DocumentContentAction } from './document-content-action';
import { IncreaseZoomAction } from './increase-zoom-action';
import { ReloadTabAction } from './reload-tab-action';
import { SetZoomAction } from './set-zoom-action';
import { ToggleMuteTabAction } from './toggle-mute-tab-action';

export function createAction(action: SupportedAction, tab: browser.tabs.Tab): Action<SupportedAction> {
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

export function createTabAction(action: TabAction, tab: browser.tabs.Tab): Action<TabAction> {
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
    case TabEventType.IncreaseZoom: {
      return new IncreaseZoomAction(action, tab);
    }
    case TabEventType.DecreaseZoom: {
      return new DecreaseZoomAction(action, tab);
    }
    case TabEventType.SetZoom: {
      return new SetZoomAction(action as SetZoomTabAction, tab);
    }
    case TabEventType.Create: {
      return new CreateTabAction(action as CreateTabActionType, tab);
    }
    default: {
      assertUnreachable(type);
    }
  }
}
