import { Routes } from '@angular/router';
import { Sidebar } from './Conveyance/components/sidebar/sidebar';
import { CreateBill } from './Conveyance/components/create-bill/create-bill';
import { DraftBills } from './Conveyance/components/draft-bills/draft-bills';
import { RejectedBills } from './Conveyance/components/rejected-bills/rejected-bills';
import { BillTracking } from './Conveyance/components/bill-tracking/bill-tracking';
import { ApprovalDashboard } from './Conveyance/components/approval-dashboard/approval-dashboard';
import { ApprovalHistory } from './Conveyance/components/approval-history/approval-history';
import { SuccessPage } from './Conveyance/components/success-page/success-page';

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
