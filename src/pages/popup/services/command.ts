import { Commands, Command, PendingCommandForm } from '../types';

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
//   ]
// }

class CommandService {
  async getCommands(hostname: string): Promise<Commands> {
    const { __test_commands } = await chrome.storage.sync.get('__test_commands');
    return __test_commands?.[hostname] ?? [];
  }

  async getPendingCommand(): Promise<Command | undefined> {
    const { __test_intercept_element: interceptedElement, __test_pending_command: pendingCommand } =
      await chrome.storage.sync.get(['__test_intercept_element', '__test_pending_command']);

    if (pendingCommand) {
      if (pendingCommand.actions.length === 0) {
        pendingCommand.actions.push({
          ...interceptedElement,
        });
      } else {
        const lastIndex = pendingCommand.actions.length - 1;
        pendingCommand.actions[lastIndex] = {
          ...pendingCommand.actions[lastIndex],
          ...interceptedElement,
        };
      }

      return pendingCommand;
    }

    return undefined;
  }

  async savePendingCommand(command: PendingCommandForm): Promise<void> {
    await chrome.storage.sync.set({ __test_pending_command: command });
  }

  async removePendingCommand(): Promise<void> {
    await chrome.storage.sync.remove('__test_intercept_element');
    await chrome.storage.sync.remove('__test_pending_command');
  }

  async saveCommand(hostname: string, command: Command): Promise<void> {
    const { __test_commands = {} } = await chrome.storage.sync.get('__test_commands');

    if (!__test_commands[hostname]) {
      __test_commands[hostname] = [];
    }

    __test_commands[hostname].push(command);

    await chrome.storage.sync.set({ __test_commands });
  }

  async deleteCommand(hostname: string, command: Command): Promise<void> {
    const { __test_commands = {} } = await chrome.storage.sync.get('__test_commands');

    if (!__test_commands?.[hostname]) {
      // there is no this command
      return;
    }

    __test_commands[hostname] = __test_commands[hostname].filter((c: Command) => c.name !== command.name);

    await chrome.storage.sync.set({ __test_commands });
  }
}

export const commandService = new CommandService();
