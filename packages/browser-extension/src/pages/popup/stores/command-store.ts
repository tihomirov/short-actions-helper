import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { assertUnreachable, isString } from 'remote-shortcuts-common/src/utils';

import { Command, Commands, CommandsType, PendingCommandForm } from '../../../common';
import { commandService } from '../services';
import { RootStore } from './root-store';

export class CommandStore {
  @observable
  private _commands: Commands = [];
  @observable
  private _commandsType: CommandsType = CommandsType.All;
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
    switch (this._commandsType) {
      case CommandsType.All:
        return this._commands;
      case CommandsType.Hostname:
        return this._commands.filter(({ hostname }) => !!hostname);
      default:
        assertUnreachable(this._commandsType);
    }
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

    const hostname = this._rootStore.tabStore.hostname;
    const response = await commandService.getCommands(hostname);

    runInAction(() => {
      if (isString(response)) {
        // TODO: handle error
      } else {
        this._commands = response;
      }

      this._isLoading = false;
    });
  }

  private async loadPendingCommands(): Promise<void> {
    runInAction(() => (this._isPendingCommandLoading = true));

    const pendingCommand = await commandService.getPendingCommand();

    runInAction(() => {
      this._pendingCommand = pendingCommand;
      this._isPendingCommandLoading = false;
    });
  }

  async getById(id: string): Promise<Command | undefined> {
    const response = await commandService.getCommandById(id);

    if (isString(response)) {
      // TODO: handle error
      return;
    }

    return response;
  }

  async removeCommand(id: string): Promise<void> {
    const response = await commandService.deleteCommand(id);

    if (isString(response)) {
      // TODO: handle error
      return;
    }

    runInAction(() => (this._commands = this._commands.filter((command) => command._id !== id)));
  }

  async createCommand(command: Omit<Command, '_id'>): Promise<void | string> {
    this._commandsType = command.hostname ? CommandsType.Hostname : CommandsType.All;
    const response = await commandService.createCommand(command);

    if (isString(response)) {
      return response;
    }

    return;
  }

  async updateCommand(command: Command): Promise<void | string> {
    this._commandsType = command.hostname ? CommandsType.Hostname : CommandsType.All;
    const response = await commandService.updateCommand(command);

    if (isString(response)) {
      return response;
    }

    return;
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
