import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestApiService } from '../../../services/rest-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  isPasswordVisible: boolean = false;
  signUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: RestApiService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  
  async signup() {
    let data = {
      ...this.signUpForm.value,
      "role": "USER"
    }
    this.api.register(data).subscribe(
      res => {
        this.toastr.success('Sign up successfully.', 'Success');
        this.router.navigate(['/login']);
      },
      err => {
        console.log(err);
        this.toastr.error('Error during sign up.', 'Error');
      }
    );
  }
}
