import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor() { }

  saveToken(token: string, userId: string, email:string): void {
    localStorage.setItem('auth_token', token);    
    localStorage.setItem('user_id', userId);
    localStorage.setItem('user_email', email);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  getCurrentUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  removeCurrentUserId(): void {
    localStorage.removeItem('user_id');
  }
}
