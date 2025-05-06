// filepath: /Users/macbook/Developer/ChatRoomApp/chat-room-frontend/src/app/app.module.ts
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './components/Auth/sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignInComponent } from './components/Auth/sign-in/sign-in.component';
import { ClickOutsideDirective } from './click-outside-directive.directive';
import { UserListComponent } from './components/user-list/user-list.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ChatService } from './services/chat.service';
import { WebSocketService } from './services/websocket.service';
import { MediaService } from './services/media.service';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    ChatComponent,
    UserListComponent,
    ChatMessageComponent,
    ClickOutsideDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AuthService,
    UserService,
    ChatService,
    WebSocketService,
    MediaService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}