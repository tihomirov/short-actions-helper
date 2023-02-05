import { CommandStore } from './command-store';

export class RootStore {
  commandStore: CommandStore;

  constructor() {
    this.commandStore = new CommandStore();
  }
}
