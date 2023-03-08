import { isString, Response, ResponseFactory } from '../../../common';
import { CurrentUser } from '../types';
import { API_URL, headers } from './constants';

class AuthService {
  async login(email: string, password: string): Promise<Response<string, string>> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (data.status === 'success') {
      return ResponseFactory.success(data.accessToken);
    } else {
      return ResponseFactory.fail(data.message);
    }
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers,
    });

    return response.json();
  }

  async register(email: string, password: string): Promise<Response<CurrentUser, string>> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    });
    const responseData = await response.json();

    if (response.status >= 200 && response.status < 300) {
      const errorMessage = isString(responseData) ? responseData : 'Can not register new user';
      return ResponseFactory.fail(errorMessage);
    }

    return ResponseFactory.success(responseData);
  }
}

export const authService = new AuthService();
