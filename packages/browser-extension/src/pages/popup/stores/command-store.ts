import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { assertExists, assertUnreachable, ResponseFactory } from '../../../common';
import { commandService } from '../services';
import { Command, Commands, CommandsType, PendingCommandForm } from '../types';
import { RootStore } from './root-store';

export class CommandStore {
  @observable
  private _commands: Commands = [];
  @observable
  private _commandsType: CommandsType = CommandsType.General;
  @observable
  private _pendingCommand: PendingCommandForm | undefined = undefined;
  @observable
  private _isLoading = false;
  @observable
  private _isPendingCommandLoading = false;

  constructor(private readonly _rootStore: RootStore) {
    makeObservable(this);
    this.loadPendingCommands();
  }

  @computed
  get commands(): Commands {
    return this._commands;
  }

  @computed
  get pendingCommand(): PendingCommandForm | undefined {
    return this._pendingCommand;
  }

  @computed
  get isLoading(): boolean {
    return this._isLoading;
  }

  @computed
  get isPendingCommandLoading(): boolean {
    return this._isPendingCommandLoading;
  }

  @computed
  get commandsType(): CommandsType {
    return this._commandsType;
  }

  @action
  setCommandsType(type: CommandsType): void {
    if (type === CommandsType.Hostname && !this._rootStore.tabStore.hostname) {
      // can not set CommandsType.Hostname if current tab is not defined
      return;
    }

    this._commandsType = type;
  }

  async loadCommands(): Promise<void> {
    runInAction(() => (this._isLoading = true));

    switch (this._commandsType) {
      case CommandsType.General:
        const generalCommands = await commandService.getCommands();
        runInAction(() => (this._commands = generalCommands));
        break;
      case CommandsType.Hostname:
        const hostname = this._rootStore.tabStore.hostname;
        assertExists(hostname, 'can not load commands by hostname; hostname is missing');

        const hostnameCommands = await commandService.getCommandsByHostname(hostname);
        runInAction(() => (this._commands = hostnameCommands));
        break;
      default:
        assertUnreachable(this._commandsType);
    }

    runInAction(() => (this._isLoading = false));
  }

  private async loadPendingCommands(): Promise<void> {
    runInAction(() => (this._isPendingCommandLoading = true));

    const pendingCommand = await commandService.getPendingCommand();

    runInAction(() => {
      this._pendingCommand = pendingCommand;
      this._isPendingCommandLoading = false;
    });
  }

  async removeCommand(id: string): Promise<void> {
    await commandService.deleteCommand(id);
    runInAction(() => (this._commands = this._commands.filter((command) => command.id !== id)));
  }

  async saveCommand(command: Omit<Command, 'id'>): Promise<void | string> {
    this._commandsType = command.hostname ? CommandsType.Hostname : CommandsType.General;
    const response = await commandService.createCommand(command);

    if (ResponseFactory.isSuccess(response)) {
      return undefined;
    }

    return response.data;
  }

  async savePendingCommand(command: PendingCommandForm): Promise<void> {
    await commandService.savePendingCommand(command);
    runInAction(() => (this._pendingCommand = command));
  }

  async removePendingCommand(): Promise<void> {
    await commandService.removePendingCommand();
    runInAction(() => (this._pendingCommand = undefined));
  }
}
