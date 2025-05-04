import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { WebSocketService } from '../../services/websocket.service';
import { Subscription, timestamp } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  isDropdownOpen = false;
  currentUserEmail = '';

  users: any[] = [];
  activeChatUsers: any[] = [];
  user1Id: number = 0;
  user2Id: number = 0;
  chatId: number = 0;
  chatMessages: { senderInitial: string, text: string, status: string, isUser2: boolean, timestamp: number}[] = [];

  secondUser: any;
  
  private messagesSubscription: Subscription | undefined;

  @ViewChild(ChatMessageComponent) chatMessageComponent!: ChatMessageComponent;
  
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private chatService: ChatService,
    private websocketService: WebSocketService,
    private router: Router
  ) {}

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  async logout(): Promise<void> {
    try {
      this.websocketService.disconnect();
      
      if (this.messagesSubscription) {
        this.messagesSubscription.unsubscribe();
      }
      
      this.authService.removeToken();
      this.authService.removeCurrentUserId();
      
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  ngOnInit(): void {
    this.currentUserEmail = this.userService.getCurrentUserEmail();
    this.user1Id = this.userService.getLoggedInUserId();
    this.loadUsers();
    this.loadActiveChats();
    
    try {
      this.websocketService.connect(this.user1Id, this.authService.getToken()!);
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  
    this.messagesSubscription = this.websocketService.getMessages().subscribe(
      (newMessage) => {
        console.log('Received message in component:', newMessage);
        if (this.isMessageForCurrentChat(newMessage)) {
          this.processReceivedMessage(newMessage);
        }
      },
      (error) => {
        console.error('WebSocket message subscription error:', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  private isMessageForCurrentChat(message: any): boolean {        
    return ((message['sender']['id'] == this.user2Id && message['receiver']['id'] == this.user1Id) ||
            (message['sender']['id'] == this.user1Id && message['receiver']['id'] == this.user2Id));
  }
  

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  createChat(userId: number) {
    this.user2Id = userId;
  
    this.chatService.createChat(this.user1Id, this.user2Id).subscribe(
      (response) => {
        this.chatId = response.chatId;
        this.secondUser = response.secondUser;
        this.fetchMessages();

      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchMessages(): void {
    if (this.chatId && this.user1Id && this.user2Id) {
      this.chatService.getMessages(this.user1Id, this.user2Id).subscribe(
        (response) => {
          this.chatMessages = response.messageList.map((msg: any) => ({
            senderInitial: msg.sender.name.charAt(0),
            text: msg.content,
            timestamp: msg.timestamp,
            status: 'Seen',
            isUser2: msg.sender.id !== this.user1Id
          }));
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );
    }
  }

  onMessageSent(newMessage: any): void {
    this.websocketService.sendMessage({ 
      senderId: this.user1Id,
      receiverId: this.user2Id,
      content: newMessage.text
    });

    const formattedMessage = {
      senderInitial: newMessage.senderInitial,
      text: newMessage.text,
      timestamp: newMessage.timestamp,
      status: 'Sent',
      isUser2: false,
    };
    
    this.chatMessages.push(formattedMessage);
  }

  private processReceivedMessage(newMessage: any): void {
    const formattedMessage = {
      senderInitial: newMessage.sender.name.charAt(0),
      text: newMessage.content,
      timestamp: newMessage.timestamp,
      status: 'Seen',
      isUser2: newMessage.senderId !== this.user1Id
    };
    
    console.log('Adding message to chat:', formattedMessage);
    this.chatMessages = [...this.chatMessages, formattedMessage];
  }

  loadActiveChats(): void {
        this.chatService.getAllChats().subscribe(
      (chats) => {
        this.activeChatUsers = chats
          .filter((chat: any) => chat.messageList && chat.messageList.length > 0)
          .map((chat: any) => {
            const otherUser = chat.firstUser.id === this.user1Id ? chat.secondUser : chat.firstUser;
            const lastMessage = chat.messageList[chat.messageList.length - 1];
            return {
              ...otherUser,
              lastMessage: lastMessage,
              lastMessageTimestamp: lastMessage?.timestamp
            };
          })
          .sort((a:any, b:any) => b.lastMessageTimestamp - a.lastMessageTimestamp)
          .slice(0, 5);
          console.log(this.activeChatUsers);
      },
      (error) => {
        console.error('Error loading active chats:', error);
      }
      
      
    );
  }

  isToday(timestamp: number): boolean {
    const messageDate = new Date(timestamp);
    const today = new Date();

    // Compare the date parts (year, month, day)
    return messageDate.getDate() === today.getDate() &&
           messageDate.getMonth() === today.getMonth() &&
           messageDate.getFullYear() === today.getFullYear();
  }
}
