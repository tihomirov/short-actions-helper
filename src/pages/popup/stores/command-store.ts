import { observable, computed, action, makeObservable } from 'mobx';
import { assertUnreachable } from '../../../common';
import { commandService } from '../services';
import { Command, Commands, PendingCommandForm, CommandsType } from '../types';
import { RootStore } from './root-store';

export class CommandStore {
  @observable
  private _commands: Commands = [];
  @observable
  private _commandsType: CommandsType = CommandsType.General;
  @observable
  private _pendingCommand: PendingCommandForm | undefined = undefined;
  @observable
  private _isLoading = true;
  @observable
  private _isPendingCommandLoading = true;

  constructor(private readonly _rootStore: RootStore) {
    makeObservable(this);
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
    this._commandsType = type;
  }

  @action
  async loadCommands(): Promise<void> {
    this._isLoading = true;

    const hostname = this._rootStore.tabStore.hostname;
    switch (this._commandsType) {
      case CommandsType.General:
        this._commands = await commandService.getCommands();
        break;
      case CommandsType.Hostname:
        this._commands = await commandService.getCommandsByHostname(hostname);
        break;
      default:
        assertUnreachable(this._commandsType);
    }

    this._isLoading = false;
  }

  @action
  async loadPendingCommands(): Promise<void> {
    this._isPendingCommandLoading = true;
    this._pendingCommand = await commandService.getPendingCommand();
    this._isPendingCommandLoading = false;
  }

  @action
  async removeCommand(id: string): Promise<void> {
    const hostname = this._rootStore.tabStore.hostname;
    this._commands = await commandService.deleteCommand(id, hostname);
  }

  @action
  async saveCommand(command: Omit<Command, 'id'>): Promise<void> {
    this._commandsType = command.hostname ? CommandsType.Hostname : CommandsType.General;
    await commandService.createCommand(command);
  }

  @action
  async savePendingCommand(command: PendingCommandForm): Promise<void> {
    await commandService.savePendingCommand(command);
    this._pendingCommand = command;
  }

  @action
  async removePendingCommand(): Promise<void> {
    await commandService.removePendingCommand();
    this._pendingCommand = undefined;
  }
}
