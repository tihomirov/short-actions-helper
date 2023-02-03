// import { ElementEvent } from '../../../common'
import { Commands, Command } from "../types";

// const commands: Record<string, Commands> = {
//   'simpsonsua.tv': [
//     {
//       name: 'Open Next Series',
//       actions: [
//         {
//           event: ElementEvent.Click,
//           element: {
//             tagName: 'a',
//             innerText: 'наступна серія'
//           }
//         }
//       ]
//     },
//     {
//       name: 'Open Previous Series',
//       actions: [
//         {
//           event: ElementEvent.Click,
//           element: {
//             tagName: 'a',
//             innerText: 'попередня серія'
//           }
//         }
//       ]
//     }
//   ]
// }

class CommandService {
  async getCommands(hostname: string): Promise<Commands> {
    const { __test_commands } = await chrome.storage.sync.get('__test_commands');
    console.log('!!!! get cpmmands', __test_commands, hostname);
    return __test_commands?.[hostname] ?? [];
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

  async saveCommand(hostname: string, command: Command): Promise<void> {
    const { __test_commands = {} } = await chrome.storage.sync.get('__test_commands');

    if (!__test_commands[hostname]) {
      __test_commands[hostname] = [];
    }
    
    __test_commands[hostname].push(command)

    console.log('!!!! save cpmmands', __test_commands);

    await chrome.storage.sync.set({ __test_commands });
  }

  async deleteCommand(hostname: string, command: Command): Promise<void> {
    const { __test_commands = {} } = await chrome.storage.sync.get('__test_commands');

    if (!__test_commands?.[hostname]) {
      // there is no this command
      return
    }
    
    __test_commands[hostname] = __test_commands[hostname].filter((c: Command) => c.name !== command.name)

    console.log('!!!! save deleted commands', __test_commands);

    await chrome.storage.sync.set({ __test_commands });
  }
}

export const commandService = new CommandService();
