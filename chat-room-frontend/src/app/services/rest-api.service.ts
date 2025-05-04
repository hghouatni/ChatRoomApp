import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, timeout } from 'rxjs';
import { AuthService } from './auth.service'; 

const apiUrl = 'http://127.0.0.1:8090';

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  public httpOptions: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) {}

  register(data: any): Observable<any> {
    const url = `${apiUrl}/api/authentication/register`;

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(url, data, this.httpOptions).pipe(
      timeout(1000),
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    const url = `${apiUrl}/api/authentication/login`;

    const body = {
      email: email,
      password: password,
    };

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(url, body, this.httpOptions).pipe(
      timeout(1000),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(error);
      })
    );
  }

  setToken(token: string, userId: string, email:string): void {
    this.authService.saveToken(token, userId, email);
  }

  getToken(): string | null {
    return this.authService.getToken();
  }

  clearToken(): void {
    this.authService.removeToken();
  }

  getProfile(): Observable<any> {
    const url = `${apiUrl}/api/authentication/user`;

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      }),
    };

    return this.http.get(url, this.httpOptions);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
