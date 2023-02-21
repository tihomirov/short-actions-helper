import { Response, ResponseFactory } from '../../../common';
import { CurrentUser } from '../types';
import { API_URL } from './constants';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

class UserService {
  async getCurrentUser(): Promise<CurrentUser> {
    const response = await fetch(`${API_URL}/auth/current-user`);
    return response.json();
  }

  async login(email: string, password: string): Promise<Response<CurrentUser, string>> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    });

    if (response.status !== 200) {
      return ResponseFactory.fail('Can not login with this email and password');
    }

    const currentUser: CurrentUser = await response.json();
    return ResponseFactory.success(currentUser);
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers,
    });

    return response.json();
  }

  async register(email: string, password: string): Promise<CurrentUser> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    });

    return response.json();
  }
}

export const userService = new UserService();
