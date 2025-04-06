import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestApiService } from '../../../services/rest-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  loginForm: FormGroup;
  isPasswordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: RestApiService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }


  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.api.login(email, password).subscribe(
      (res: any) => {
        this.api.setToken(res.access_token, res.id, res.email);
        this.toastr.success('Login successful!', 'Success');
        this.router.navigate(['/chat']);
      },
      (err) => {
        console.error(err);
        this.toastr.error('Invalid credentials or error occurred during login.', 'Error');
      }
    );
  }

}
