import { observable, computed, action, makeObservable } from 'mobx';
import { commandService } from '../services';
import { Command, Commands } from '../types';
import { RootStore } from './root-store';

export class CommandStore {
  @observable
  private _commands: Commands = [];
  @observable
  private _isLoading = true;

  constructor(private readonly _rootStore: RootStore) {
    makeObservable(this);
  }

  @computed
  get commands(): Commands {
    return this._commands;
  }

  @computed
  get isLoading(): boolean {
    return this._isLoading;
  }

  @action
  async loadCommands(): Promise<void> {
    this._isLoading = true;

    const hostname = this._rootStore.tabStore.hostname;
    this._commands = await commandService.getCommands(hostname);

    this._isLoading = false;
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
    this._commands = await commandService.getCommands(hostname);
  }
}
