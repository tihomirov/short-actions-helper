import { observable, computed, makeObservable, runInAction } from 'mobx';
import { ResponseFactory } from '../../../common';
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

  private async loadCurrentUser(): Promise<void> {
    runInAction(() => (this._currentUserLoading = true));

    const currentUser = await userService.getCurrentUser();

    runInAction(() => {
      this._currentUser = currentUser ?? undefined;
      this._currentUserLoading = false;
    });
  }

  async login(email: string, password: string): Promise<void | string> {
    const response = await userService.login(email, password);

    if (ResponseFactory.isSuccess(response)) {
      runInAction(() => (this._currentUser = response.data));
      return;
    }

    return response.data;
  }

  async register(email: string, password: string): Promise<void> {
    runInAction(() => (this._currentUserLoading = true));

    const currentUser = await userService.register(email, password);

    runInAction(() => {
      this._currentUser = currentUser;
      this._currentUserLoading = false;
    });
  }

  async logout(): Promise<void> {
    await userService.logout();
    runInAction(() => (this._currentUser = undefined));
  }
}
