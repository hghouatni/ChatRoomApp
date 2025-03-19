import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://127.0.0.1:8080/api/chats/';

  constructor(private http: HttpClient) { }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  createChat(user1Id: number, user2Id: number): Observable<any> {
    const chatRequest = {
      user1Id: user1Id,
      user2Id: user2Id
    };

    const token = this.getAuthToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl + 'createChat', chatRequest, { headers });
  }

  getMessages(firstUser: number, secondUser: number): Observable<any> {
    const token = this.getAuthToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.apiUrl}conversation/${firstUser}/${secondUser}`;
    return this.http.get<any>(url, { headers });
  }

  sendMessage(chatId: number, senderId: number, receiverId: number, content: string, timestamp: string): Observable<any> {
    const message = {
      senderId: senderId,
      receiverId: receiverId,
      content: content,
      timestamp: timestamp
    };

    const token = this.getAuthToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.apiUrl}message/${chatId}`;
    return this.http.put(url, message, { headers });
  }

  getAllChats(): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(this.apiUrl + 'all', { headers });
  }
}
