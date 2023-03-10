import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { isString } from 'remote-shortcuts-common/src/utils';

import { connectionError, userService } from '../services';
import { CurrentUser } from '../types';
import { RootStore } from './root-store';

export class UserStore {
  @observable
  private _currentUser: CurrentUser | undefined = undefined;
  @observable
  private _currentUserLoading = false;

  constructor(private readonly _rootStore: RootStore) {
    makeObservable(this);
    void this.loadCurrentUser();
  }

  @computed
  get currentUserLoading(): boolean {
    return this._currentUserLoading;
  }

  @computed
  get currentUser(): CurrentUser | undefined {
    return this._currentUser;
  }

  async loadCurrentUser(): Promise<void> {
    runInAction(() => (this._currentUserLoading = true));

    const response = await userService.getCurrentUser();

    runInAction(() => {
      if (!isString(response)) {
        this._currentUser = response;
      } else if (response === connectionError) {
        this._rootStore.connectionStore.setConnectionError(true);
      }

      this._currentUserLoading = false;
    });
  }

  @action
  setCurrentUser(user: CurrentUser | undefined): void {
    this._currentUser = user;
  }
}
