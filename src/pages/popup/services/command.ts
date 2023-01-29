import { ElementAction } from '../../../common'
import { Commands } from "../types";

const commands: Commands = [
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

class CommandService {
  getCommands(): Commands {
    return commands;
  }
}

export const commandService = new CommandService();
