import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserInfo } from '../../pages/models/bill.mode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private platformId = inject(PLATFORM_ID);

    currentUser = signal<UserInfo | null>(null);

    constructor() {
        this.loadUserOnStartup();
    }

    private loadUserOnStartup() {
        if (isPlatformBrowser(this.platformId)) {
            const data = localStorage.getItem('user_data');
            if (data) {
                try {
                    const parsedUser = JSON.parse(data) as UserInfo;
                    this.currentUser.set(parsedUser);
                } catch (e) {
                    console.error("LocalStorage Parse Error", e);
                }
            }
        }
    }

    setUser(user: UserInfo) {
        const today = new Date().toLocaleDateString('en-GB');
        const UserWithDate = { ...user, submitDate: today }

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user_data', JSON.stringify(UserWithDate));
        }
        this.currentUser.set(UserWithDate);
    }

    clearUser() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('user_data');
        }

        this.currentUser.set(null);
    }
}