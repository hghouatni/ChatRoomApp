import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './components/Auth/sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { SignInComponent } from './components/Auth/sign-in/sign-in.component';
import { ChatComponent } from './components/chat/chat.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { WebSocketService } from './services/websocket.service';
import { ClickOutsideDirective } from './click-outside-directive.directive';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    ChatComponent,
    UserListComponent,
    ChatMessageComponent,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    provideAnimations(),
    provideToastr(), 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }