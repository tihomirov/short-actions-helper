import { ElementAction } from '../../../common'
import { Commands } from "../types";

const commands: Record<string, Commands> = {
  'simpsonsua.tv': [
    {
      name: 'Open Next Series',
      actions: [
        {
          elementAction: ElementAction.Click,
          elementTagName: 'a',
          elementInnerText: 'наступна серія'
        }
      ]
    },
    {
      name: 'Open Previous Series',
      actions: [
        {
          elementAction: ElementAction.Click,
          elementTagName: 'a',
          elementInnerText: 'попередня серія'
        }
      ]
    }
  ]
}

class CommandService {
  getCommands(hostname: string): Commands {
    return commands[hostname] ?? [];
  }
}

export const commandService = new CommandService();
