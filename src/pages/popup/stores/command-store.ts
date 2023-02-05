import { observable, computed, action, makeObservable } from 'mobx';
import { commandService } from '../services';
import { Command, Commands } from '../types';

export class CommandStore {
  @observable
  private _commands: Commands = [];
  @observable
  private _isLoading = true;

  constructor() {
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
  async loadCommands(hostname: string): Promise<void> {
    this._isLoading = true;
    this._commands = await commandService.getCommands(hostname);
    this._isLoading = false;
  }

  @action
  async removeCommand(hostname: string, command: Command): Promise<void> {
    await commandService.deleteCommand(hostname, command);
    this._commands = await commandService.getCommands(hostname);
  }

  @action
  async saveCommand(hostname: string, command: Command): Promise<void> {
    await commandService.saveCommand(hostname, command);
    this._commands = await commandService.getCommands(hostname);
  }
}
