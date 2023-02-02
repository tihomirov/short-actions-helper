import { ElementEvent, ElementData } from '../../../common'
import { Commands } from "../types";

const commands: Record<string, Commands> = {
  'simpsonsua.tv': [
    {
      name: 'Open Next Series',
      actions: [
        {
          event: ElementEvent.Click,
          element: {
            tagName: 'a',
            innerText: 'наступна серія'
          }
        }
      ]
    },
    {
      name: 'Open Previous Series',
      actions: [
        {
          event: ElementEvent.Click,
          element: {
            tagName: 'a',
            innerText: 'попередня серія'
          }
        }
      ]
    }
  ]
}

class CommandService {
  getCommands(hostname: string): Commands {
    return commands[hostname] ?? [];
  }

  async getPendingInterceptedElement(): Promise<ElementData | undefined> {
    const element = await chrome.storage.sync.get('__test_intercept_element');
    console.log('!!!!! __test_intercept_element', element.__test_intercept_element);
    return element.__test_intercept_element as ElementData
  }

  addCommand(): void {
    console.log('add command')
  }
}

export const commandService = new CommandService();
