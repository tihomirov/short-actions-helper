import { AuthStore } from './auth-store';
import { CommandStore } from './command-store';
import { MessageChannelStore } from './message-channel-store';
import { TabStore } from './tab-store';
import { UserStore } from './user-store';

export class RootStore {
  messageChannelStore: MessageChannelStore;
  tabStore: TabStore;
  commandStore: CommandStore;
  userStore: UserStore;
  authStore: AuthStore;

  constructor() {
    this.messageChannelStore = new MessageChannelStore();
    this.tabStore = new TabStore();
    this.commandStore = new CommandStore(this);
    this.userStore = new UserStore();
    this.authStore = new AuthStore(this);
  }
}
