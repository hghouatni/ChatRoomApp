import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RxStomp } from '@stomp/rx-stomp';
import { RxStompConfig } from '@stomp/rx-stomp';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private messagesSubject: Subject<any> = new Subject<any>();
  private isConnected = false;
  private rxStomp: RxStomp;

  private rxStompConfig: RxStompConfig = {
    brokerURL: 'http://127.0.0.1:8090/ws',
    debug: (str) => {
      console.log(str);
    },
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
  };

  constructor() {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure(this.rxStompConfig);
    this.rxStomp.activate();
  }

  connect(userId: number, token: string): void {
    if (this.isConnected) {
      console.log('Already connected');
      return;
    }

    this.rxStompConfig.connectHeaders = {
      Authorization: `Bearer ${token}`,
    };

    this.rxStomp.configure(this.rxStompConfig);
    this.rxStomp.activate();

    this.rxStomp.connected$.subscribe(() => {
      console.log('STOMP connected');
      this.isConnected = true;
            
      this.rxStomp.watch(`/queue/messages/${userId}`).subscribe((messageOutput) => {
        console.log("Raw message received:", messageOutput);
        console.log("Message body:", messageOutput.body);
      
        try {
          const message = JSON.parse(messageOutput.body);
          console.log("Parsed message:", message);
          this.messagesSubject.next(message);
        } catch (error) {
          console.error('Error parsing message:', error);
          console.error('Problematic message body:', messageOutput.body);
        }
      });
    });

    this.rxStomp.stompErrors$.subscribe((error) => {
      console.error('STOMP connection error:', error);
    });
  }

  sendMessage(message: any): void {
    if (this.isConnected) {
      console.log(message);
      
      const destination = '/app/chat.sendMessage';            
      this.rxStomp.publish({
        destination: destination,
        body: JSON.stringify(message)
      });
      console.log('Message sent:', message);
    } else {
      console.error('STOMP client is not connected. Unable to send message.');
      this.reconnect();
    }
  }

  disconnect(): void {
    this.rxStomp.deactivate();
    console.log('Disconnected from STOMP');
    this.isConnected = false;
  }

  getMessages(): Subject<any> {
    return this.messagesSubject;
  }

  isOpen(): boolean {
    return this.isConnected;
  }

  private reconnect(): void {
    if (!this.isConnected) {
      setTimeout(() => {
        console.log('Reconnecting WebSocket...');
        this.connect(1, 'your-token-here'); 
      }, 5000);
    }
  }

  subscribeToMessages(userId: number): void {
    if (this.isConnected) {
      console.log(`Subscribing to /queue/messages/${userId}`);
      this.rxStomp.watch(`/queue/messages/${userId}`).subscribe((messageOutput) => {
        try {
          const message = JSON.parse(messageOutput.body);
          this.messagesSubject.next(message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
    }
  }
}