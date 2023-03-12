import { assertUnreachable } from 'remote-shortcuts-common/src/utils';

import { TabMessage, TabMessageEvent, TabMessageResponse } from '../common';
import { ActionEvent, CheckElementExistEvent, DebbugEvent, InterceptElementEvent, MessageEvent } from './events';

chrome.runtime.onMessage.addListener((message: TabMessage, sender, sendResponse) => {
  const event = mapMessageToEvent(message);
  if (!event) {
    return;
  }

  const response = event.run();
  return sendResponse(response);
});

function mapMessageToEvent(message: TabMessage): MessageEvent<TabMessage, TabMessageResponse[TabMessageEvent]> {
  const event = message.event;

  switch (event) {
    case TabMessageEvent.Debbug:
      return new DebbugEvent(message);
    case TabMessageEvent.RunAction:
      return new ActionEvent(message);
    case TabMessageEvent.InterceptElement:
      return new InterceptElementEvent(message);
    case TabMessageEvent.CheckElementExist:
      return new CheckElementExistEvent(message);
    default:
      assertUnreachable(event);
  }
}
