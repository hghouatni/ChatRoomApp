import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs"
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class MediaService {
  private chatApiUrl = "http://127.0.0.1:8090/api/chats/media/"

  constructor(private http: HttpClient) {}

  private getAuthToken(): string | null {
    return localStorage.getItem("auth_token")
  }

  uploadMedia(chatId: number, senderId: number, receiverId: number, file: File, type: string): Observable<any> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("senderId", senderId.toString())
    formData.append("receiverId", receiverId.toString())
    formData.append("timestamp", new Date().toISOString())
    formData.append("type", type)
    formData.append("content", type === 'audio' ? 'Audio message' : 'Image shared')

    const token = this.getAuthToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    return this.http.post(`${this.chatApiUrl}${chatId}`, formData, { headers })
      .pipe(
        tap(response => {
          console.log('Media upload response:', response);
        })
      );
  }

  getMediaAsBlob(mediaUrl: string): Observable<Blob> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.get(mediaUrl, {
      headers,
      responseType: 'blob',
    }).pipe(
      tap(blob => {
        console.log('Media blob received:', blob.type, blob.size);
      })
    );
  }
}