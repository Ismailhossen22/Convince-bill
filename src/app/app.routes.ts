import { Routes } from '@angular/router';
import { Sidebar } from './pages/components/sidebar/sidebar';
import { CreateBill } from './pages/components/create-bill/create-bill';
import { DraftBills } from './pages/components/draft-bills/draft-bills';
import { RejectedBills } from './pages/components/rejected-bills/rejected-bills';
import { BillTracking } from './pages/components/bill-tracking/bill-tracking';
import { ApprovalDashboard } from './pages/components/approval-dashboard/approval-dashboard';
import { ApprovalHistory } from './pages/components/approval-history/approval-history';
import { SuccessPage } from './pages/components/success-page/success-page';


export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./features/login/login').then(m => m.Login), pathMatch: 'full' },
    // { path: 'home', loadComponent: () => import('./features/home/home').then(m => m.Home), pathMatch: 'full' },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'navbar', component: Sidebar },
    { path: 'create-bill', component: CreateBill },
    { path: 'draft-bills', component: DraftBills },
    { path: 'rejected-bills', component: RejectedBills },
    { path: 'bill-tracking', component: BillTracking },
    { path: 'approval-dashboard', component: ApprovalDashboard },
    { path: 'approval-history', component: ApprovalHistory },
    //{ path: 'monthly-report', component: MonthlyReport},
    { path: 'success', component: SuccessPage },

    { path: '**', redirectTo: 'login', pathMatch: 'full' },






];
