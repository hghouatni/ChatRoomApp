import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SignUpComponent } from './components/Auth/sign-up/sign-up.component';
import { SignInComponent } from './components/Auth/sign-in/sign-in.component';
import { AuthGuard } from './guards/auth.guard';
import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'login',
    component: SignInComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/login', 
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
