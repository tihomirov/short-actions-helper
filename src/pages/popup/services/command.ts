import { ElementEvent } from '../../../common'
import { Commands, Command } from "../types";

const commands: Record<string, Commands> = {
  'simpsonsua.tv': [
    // {
    //   name: 'Open Next Series',
    //   actions: [
    //     {
    //       event: ElementEvent.Click,
    //       element: {
    //         tagName: 'a',
    //         innerText: 'наступна серія'
    //       }
    //     }
    //   ]
    // },
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

  async getPendingCommand(): Promise<Command | undefined> {
    const { __test_intercept_element,  __test_pending_command } = await chrome.storage.sync.get(['__test_intercept_element', '__test_pending_command']);

    if (__test_pending_command) {
      __test_pending_command.actions[__test_pending_command.actions.length - 1].element = __test_intercept_element;

      return __test_pending_command;
    }

    return undefined;
  }

  async savePendingCommand(command: Partial<Command>): Promise<void> {
    await chrome.storage.sync.set({ __test_pending_command: command });
  }

  addCommand(): void {
    console.log('add command')
  }
}

export const commandService = new CommandService();
