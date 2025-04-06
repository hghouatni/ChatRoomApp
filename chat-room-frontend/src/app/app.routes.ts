import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SignUpComponent } from './components/Auth/sign-up/sign-up.component';
import { SignInComponent } from './components/Auth/sign-in/sign-in.component';
import { AuthGuard } from './guards/auth.guard';

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
