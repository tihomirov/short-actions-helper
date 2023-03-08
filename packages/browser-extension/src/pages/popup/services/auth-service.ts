import {
  assertWithTypeguard,
  isString,
  ResponseFactory,
  responseTypeguard,
  typeguard,
} from 'remote-shortcuts-common/src/utils';

import { CurrentUser } from '../types';
import { API_URL, headers } from './constants';

class AuthService {
  async login(email: string, password: string): Promise<string | undefined> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    }).then((res) => res.json());

    assertWithTypeguard(response, responseTypeguard());

    return ResponseFactory.isSuccess(response) ? undefined : response.data.message;
  }

  async logout(): Promise<string | undefined> {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers,
    }).then((res) => res.json());

    assertWithTypeguard(response, responseTypeguard());

    return ResponseFactory.isSuccess(response) ? undefined : response.data.message;
  }

  async register(email: string, password: string): Promise<CurrentUser | string> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    }).then((res) => res.json());

    const userTypeguard = typeguard<CurrentUser>(['_id', isString], ['email', isString]);
    assertWithTypeguard(response, responseTypeguard(userTypeguard));

    return ResponseFactory.isSuccess(response) ? response.data : response.data.message;
  }
}

export const authService = new AuthService();
