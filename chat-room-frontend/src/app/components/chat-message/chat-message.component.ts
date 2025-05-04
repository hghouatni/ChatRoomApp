import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent {
  
  @Input() messages: { senderInitial: string, text: string, status: string, isUser2: boolean, timestamp: number}[] = [];
  @Input() chatId: number = 0;   
  @Input() senderId: number = 0;
  @Input() receiverId: number = 0;
  @Input() user: any = null;

  @Output() messageSent = new EventEmitter<any>();

  messageContent: string = '';
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
  ) { }

  sendMessage() {
  if (this.messageContent.trim()) {
    const timestamp = new Date().toISOString();
    this.chatService.sendMessage(this.chatId, this.senderId, this.receiverId, this.messageContent, timestamp)
      .subscribe(response => {    
        const newMessage = {
          senderInitial: response.sender.name.charAt(0),
          text: response.content,
          timestamp: response.timestamp,
          status: 'Sent',
          isUser2: response.sender.id !== this.senderId
        };
                
        this.messageSent.emit(newMessage); 
        this.messageContent = '';
      }, error => {
        console.error('Error sending message:', error);
      });
  }
}

  isToday(timestamp: number): boolean {
    const messageDate = new Date(timestamp);
    const today = new Date();

    // Compare the date parts (year, month, day)
    return messageDate.getDate() === today.getDate() &&
          messageDate.getMonth() === today.getMonth() &&
          messageDate.getFullYear() === today.getFullYear();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
}
