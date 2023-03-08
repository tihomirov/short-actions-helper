import { ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { authService } from '../services';
import { RootStore } from './root-store';

export class AuthStore {
  constructor(private readonly _rootStore: RootStore) {}

  async login(email: string, password: string): Promise<void | string> {
    const response = await authService.login(email, password);

    if (ResponseFactory.isSuccess(response)) {
      await this._rootStore.userStore.loadCurrentUser();
      return;
    }

    return response.data;
  }

  async register(email: string, password: string): Promise<void | string> {
    const response = await authService.register(email, password);

    if (ResponseFactory.isSuccess(response)) {
      await this._rootStore.userStore.loadCurrentUser();
      this._rootStore.userStore.setCurrentUser(undefined);
      return;
    }

    return response.data;
  }

  async logout(): Promise<void> {
    await authService.logout();
    this._rootStore.userStore.setCurrentUser(undefined);
  }
}
