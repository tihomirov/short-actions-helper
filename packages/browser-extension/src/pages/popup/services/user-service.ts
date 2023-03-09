import { assertWithTypeguard, ResponseFactory, responseTypeguard } from 'remote-shortcuts-common/src/utils';

import { CurrentUser } from '../types';
import { API_URL, headers } from './constants';
import { currentUserTypeguard } from './typeguards';

class UserService {
  async getCurrentUser(): Promise<CurrentUser | string> {
    const response = await fetch(`${API_URL}/users/current-user`, { headers }).then((res) => res.json());

    assertWithTypeguard(response, responseTypeguard(currentUserTypeguard));

    return ResponseFactory.isSuccess(response) ? response.data.user : response.data.message;
  }
}

export const userService = new UserService();
