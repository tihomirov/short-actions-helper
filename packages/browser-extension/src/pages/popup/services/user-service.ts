import { assertWithTypeguard, ResponseFactory, responseTypeguard } from 'remote-shortcuts-common/src/utils';

import { CurrentUser } from '../types';
import { API_URL, headers } from './constants';
import { currentUserResponseTypeguard } from './typeguards';

class UserService {
  async getCurrentUser(): Promise<CurrentUser | string> {
    const response = await fetch(`${API_URL}/users/current-user`, { headers }).then((res) => res.json());

    assertWithTypeguard(response, responseTypeguard(currentUserResponseTypeguard));

    return ResponseFactory.isSuccess(response) ? response.data.user : response.data.message;
  }
}

export const userService = new UserService();
