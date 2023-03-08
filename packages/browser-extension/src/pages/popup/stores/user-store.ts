import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { userService } from '../services';
import { CurrentUser } from '../types';

export class UserStore {
  @observable
  private _currentUser: CurrentUser | undefined = undefined;
  @observable
  private _currentUserLoading = false;

  constructor() {
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

    if (response.isSuccess) {
      runInAction(() => {
        this._currentUser = response.data;
      });
    }

    runInAction(() => {
      this._currentUserLoading = false;
    });
  }

  @action
  setCurrentUser(user: CurrentUser | undefined): void {
    this._currentUser = user;
  }
}
