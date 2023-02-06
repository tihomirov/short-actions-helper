import { CommandStore } from './command-store';
import { TabStore } from './tab-store';
import { MessageChannelStore } from './message-channel-store';

export class RootStore {
  messageChannelStore: MessageChannelStore;
  tabStore: TabStore;
  commandStore: CommandStore;

  constructor() {
    this.messageChannelStore = new MessageChannelStore();
    this.tabStore = new TabStore();
    this.commandStore = new CommandStore(this);
  }
}
