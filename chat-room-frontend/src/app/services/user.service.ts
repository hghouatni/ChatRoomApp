import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:8080/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    } else {
      return new HttpHeaders();
    }
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      map(users => {
        const currentUserId = this.authService.getCurrentUserId();
        console.log("user ID:"+currentUserId);
        
        return users.filter((user: any) => Number(user.id) !== Number(currentUserId));
      }),
      catchError(this.handleError)
    );
  }

  getLoggedInUserId(): number {
    return Number(localStorage.getItem('user_id'));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }

  getCurrentUserEmail(): string {
  // Implement based on your user data storage
  return localStorage.getItem('user_email') || 'user@example.com';
}
}
