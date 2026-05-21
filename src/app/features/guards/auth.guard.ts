import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/AuthService";
import { inject } from "@angular/core";
import { ROLE_STATUS_MAP } from "../../pages/models/bill-workflow.config";
import { BillStatusName } from "../../pages/models/bill.mode";




export const approvalGuard: CanActivateFn = (route, state) => {


    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.currentUser()?.role || '';
    const userAllowedStatusId = ROLE_STATUS_MAP[userRole] || BillStatusName.Draft

    if (userAllowedStatusId >= BillStatusName.PendingSupervisor) {
        return true;
    }

    console.warn('User not permit this route');
    router.navigate(['/home']);
    return false;




}