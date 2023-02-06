import { CommandStore } from './command-store';
import { TabStore } from './tab-store';

export class RootStore {
  commandStore: CommandStore;
  tabStore: TabStore;

  constructor() {
    this.commandStore = new CommandStore(this);
    this.tabStore = new TabStore();
  }
}
