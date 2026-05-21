import { Routes } from '@angular/router';
import { Sidebar } from './pages/components/sidebar/sidebar';
import { CreateBill } from './pages/components/create-bill/create-bill';
import { DraftBills } from './pages/components/draft-bills/draft-bills';
import { RejectedBills } from './pages/components/rejected-bills/rejected-bills';
import { BillTracking } from './pages/components/bill-tracking/bill-tracking';
import { ApprovalDashboard } from './pages/components/approval-dashboard/approval-dashboard';
import { ApprovalHistory } from './pages/components/approval-history/approval-history';
import { SuccessPage } from './pages/components/success-page/success-page';
import { MonthlyReport } from './pages/components/monthly-report/monthly-report';
import { ApprovalDashboardDetails } from './pages/components/approval-dashboard-details/approval-dashboard-details';
import { approvalGuard } from './features/guards/auth.guard';


export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./features/login/login').then(m => m.Login), pathMatch: 'full' },
    // { path: 'home', loadComponent: () => import('./features/home/home').then(m => m.Home), pathMatch: 'full' },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: Sidebar },
    { path: 'create-bill', component: CreateBill },
    { path: 'draft-bills', component: DraftBills },
    { path: 'rejected-bills', component: RejectedBills },
    { path: 'bill-tracking', component: BillTracking },
    {
        path: 'approval-dashboard',
        component: ApprovalDashboard,
        canActivate: [approvalGuard]
    },
    {
        path: 'approval-details',
        component: ApprovalDashboardDetails,
        canActivate: [approvalGuard]
    },
    {
        path: 'approval-history',
        component: ApprovalHistory,
       
    },
    {
        path: 'monthly-report',
        component: MonthlyReport,
        canActivate: [approvalGuard]
    },
    { path: '**', redirectTo: 'login', pathMatch: 'full' },

];
