import { Component, inject, signal } from '@angular/core';
import { LoginData } from '../../shared/class/login_data';
import { debounce, form, FormField, pattern, required } from '@angular/forms/signals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly router = inject(Router);
  userInfo = signal<LoginData>({
    email: '',
    password: ''
  });

  loginForm = form(this.userInfo, (schemaPath) => {
    debounce(schemaPath.email, 200);
    debounce(schemaPath.password, 200);
    required(schemaPath.email, { message: 'Email is required' });
    pattern(schemaPath.email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'Email is invalid' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  login(e: Event) {
    debugger
    e.preventDefault();
    this.markFormGroupTouched(this.loginForm);
    console.log(this.loginForm().value());
    console.log(this.userInfo());
    if (this.loginForm().valid()) {
      this.router.navigate(['/home'], { state: { userInfo: this.loginForm().value() } });
    }
  }

  private markFormGroupTouched(form: any) {
    Object.values(form).forEach((control: any) => {
      if (typeof control === 'function' && control().markAsTouched) {
        control().markAsTouched();
      }
    });
  }
}
