import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../features/services/AuthService';
import { ROLE_STATUS_MAP } from '../../models/bill-workflow.config';
import { BillStatusName } from '../../models/bill.mode';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  private autheService = inject(AuthService)
  private allMenuItems = [
    { icon: '➕', label: 'Create Bill', route: '/create-bill', isApprovalMenu: false },
    { icon: '📋', label: 'Draft Bills', route: '/draft-bills', isApprovalMenu: false },
    { icon: '❌', label: 'Rejected Bills', route: '/rejected-bills', isApprovalMenu: false },
    { icon: '📊', label: 'Bill Tracking /Summary', route: '/bill-tracking', isApprovalMenu: false },

    { icon: '✅', label: 'Approval Dashboard', route: '/approval-dashboard', isApprovalMenu: true },
    { icon: '🕐', label: 'Approval History', route: '/approval-history', isApprovalMenu: true },
    { icon: '📅', label: 'Monthly Report', route: '/monthly-report', isApprovalMenu: true },
  ];


  isApprover = computed(() => {
    const roleName = this.autheService.currentUser()?.role || '';
    const statusId = ROLE_STATUS_MAP[roleName] || BillStatusName.Draft;

    // স্ট্যাটাস ৪ বা তার বেশি হলেই সে একজন Approver (True)
    return statusId >= BillStatusName.PendingSupervisor;
  });

  get menuItems() {


    if (this.isApprover()) {
      return this.allMenuItems;
    }
    return this.allMenuItems.filter(item => !item.isApprovalMenu);
  }

  logout(): void {
    this.autheService.clearUser()
  }
}
