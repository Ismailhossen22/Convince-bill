import { Injectable, signal } from '@angular/core';

import { BillStatusName } from '../models/bill.mode';
import { WORKFLOW_RULES } from '../models/bill-workflow.config';

@Injectable({
  providedIn: 'root'
})
export class BillWorkflowService {
  
  currentUserRole = signal<string>('Supervisor'); 
 
  canUserApprove(currentBillStatus: BillStatusName): boolean {
    const role = this.currentUserRole();
    const rule = WORKFLOW_RULES[role];

    // যদি এই রোলের জন্য কোনো নিয়ম না থাকে অথবা বিলের বর্তমান স্ট্যাটাস নিয়মের সাথে না মিলে
    if (!rule || rule.currentStatus !== currentBillStatus) {
      return false;
    }
    return true;
  }

  /**
   * এপ্রুভ বাটনে ক্লিক করলে পরবর্তী স্ট্যাটাস আইডি কত হবে তা বের করার ফাংশন
   */
  getNextStatus(currentBillStatus: BillStatusName): BillStatusName | null {
    const role = this.currentUserRole();
    const rule = WORKFLOW_RULES[role];

    if (rule && rule.currentStatus === currentBillStatus) {
      return rule.nextStatus;
    }
    return null;
  }
}