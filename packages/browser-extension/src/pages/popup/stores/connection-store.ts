import { action, computed, makeObservable, observable } from 'mobx';

export class ConnectionStore {
  @observable
  private _hasConnectionError = false;

  constructor() {
    makeObservable(this);
  }

  @computed
  get hasConnectionError(): boolean {
    return this._hasConnectionError;
  }

  @action
  setConnectionError(value: boolean): void {
    this._hasConnectionError = value;
  }
}
