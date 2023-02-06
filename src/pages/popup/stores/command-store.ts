import { observable, computed, action, makeObservable } from 'mobx';
import { actionService, commandService } from '../services';
import { Command, Commands, PendingCommand } from '../types';
import { RootStore } from './root-store';

export class CommandStore {
  @observable
  private _commands: Commands = [];
  @observable
  private _pendingCommand: PendingCommand | undefined = undefined;
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
  get pendingCommand(): PendingCommand | undefined {
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

  @action
  async loadCommands(): Promise<void> {
    this._isLoading = true;

    const hostname = this._rootStore.tabStore.hostname;
    this._commands = await commandService.getCommands(hostname);

    this._isLoading = false;
  }

  @action
  async loadPendingCommands(): Promise<void> {
    this._isPendingCommandLoading = true;
    this._pendingCommand = await commandService.getPendingCommand();
    this._isPendingCommandLoading = false;
  }

  @action
  async removeCommand(command: Command): Promise<void> {
    const hostname = this._rootStore.tabStore.hostname;
    await commandService.deleteCommand(hostname, command);
    this._commands = await commandService.getCommands(hostname);
  }

  @action
  async saveCommand(command: Command): Promise<void> {
    const hostname = this._rootStore.tabStore.hostname;
    await commandService.saveCommand(hostname, command);
  }

  @action
  async runCommand(command: Command): Promise<void> {
    await actionService.runActions(command.actions);
  }

  @action
  async savePendingCommand(command: PendingCommand): Promise<void> {
    await commandService.savePendingCommand(command);
    this._pendingCommand = command;
  }

  @action
  async removePendingCommand(): Promise<void> {
    await commandService.removePendingCommand();
    this._pendingCommand = undefined;
  }
}
