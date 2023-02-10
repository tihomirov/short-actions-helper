import { TabEvent, TabMessage } from '../common';
import { DebbugEvent, ActionEvent, InterceptElementEvent, MessageEvent } from './events';

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
    case TabEvent.Debbug:
      return new DebbugEvent(message);
    case TabEvent.RunAction:
      return new ActionEvent(message);
    case TabEvent.InterceptElement:
      return new InterceptElementEvent(message);
    default:
      return undefined;
  }
}
