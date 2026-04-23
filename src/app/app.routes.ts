import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./features/login/login').then(m => m.Login), pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./features/home/home').then(m => m.Home), pathMatch: 'full' },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
