import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/AuthService';
import { UserInfo } from '../models/user.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly router = inject(Router);
  private http = inject(HttpClient)
  private authService = inject(AuthService);
  private url = 'json/user.json'



  loginForm = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })
  login(e: Event, formEl: HTMLFormElement) {
    e.preventDefault();
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      formEl.reportValidity();
      return;
    }


    const loginCredentials = this.loginForm.value;


    this.http.get<UserInfo[]>(this.url).subscribe({
      next: (users) => {

        const authenticatedUser = users.find(u =>
          u.userId === Number(loginCredentials.userId) &&
          u.password === loginCredentials.password
        );

        if (authenticatedUser) {
          console.log("লগইন সফল হয়েছে!");

          this.authService.setUser(authenticatedUser)

          this.router.navigate(['/home']);
        } else {

          alert("Wrong UserId or password!");
        }
      },
      error: (err) => {
        console.error("ডাটা লোড করতে সমস্যা হয়েছে:", err);

      }
    });
  }






}
