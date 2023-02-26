import { TabMessage, TabMessageEvent } from '../common';
import { ActionEvent, DebbugEvent, InterceptElementEvent, MessageEvent } from './events';

chrome.runtime.onMessage.addListener((message: TabMessage, sender, sendResponse) => {
  const event = mapMessageToEvent(message);
  if (!event) {
    return;
  }

  const response = event.run();
  return sendResponse(response);
});

function mapMessageToEvent(message: TabMessage): MessageEvent | undefined {
  switch (message.event) {
    case TabMessageEvent.Debbug:
      return new DebbugEvent(message);
    case TabMessageEvent.RunAction:
      return new ActionEvent(message);
    case TabMessageEvent.InterceptElement:
      return new InterceptElementEvent(message);
    default:
      return undefined;
  }
}
