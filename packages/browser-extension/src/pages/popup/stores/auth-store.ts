import { isString } from 'remote-shortcuts-common/src/utils';

import { authService } from '../services';
import { RootStore } from './root-store';

export class AuthStore {
  constructor(private readonly _rootStore: RootStore) {}

  async login(email: string, password: string): Promise<void | string> {
    const error = await authService.login(email, password);

    if (!error) {
      await this._rootStore.userStore.loadCurrentUser();
    }

    return error;
  }

  async register(email: string, password: string): Promise<void | string> {
    const response = await authService.register(email, password);

    if (isString(response)) {
      return response;
    }

    this._rootStore.userStore.setCurrentUser(response);
  }

  async logout(): Promise<void> {
    await authService.logout();
    this._rootStore.userStore.setCurrentUser(undefined);
  }
}
