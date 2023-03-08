import { Response, ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { CurrentUser } from '../types';
import { API_URL, headers } from './constants';

class UserService {
  async getCurrentUser(): Promise<Response<CurrentUser, string>> {
    const response = await fetch(`${API_URL}/users/current-user`, { headers });
    const data = await response.json();

    if (data.status === 'success') {
      const {
        data: { user },
      } = data;
      return ResponseFactory.success(user as CurrentUser);
    } else {
      return ResponseFactory.fail(data.message);
    }
  }
}

export const userService = new UserService();
