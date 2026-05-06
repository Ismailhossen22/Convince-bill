import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BillService } from '../../services/bill.service';

import { Router } from '@angular/router';
import { Bill } from '../../models/bill.mode';

@Component({
  selector: 'app-draft-bills',
  imports: [],
  templateUrl: './draft-bills.html',
  styleUrl: './draft-bills.css',
})
export class DraftBills {

  private billService = inject(BillService);

  private router = inject(Router)

  draftBills = this.billService.draftBills;

  calculateTotalAmount = computed(() =>
    this.draftBills().reduce((sum, bill) => sum + bill.totalAmount, 0)
  );

  // calculateTotalAmounts = computed(() => {
  //   let runningTotal = 0;
  //   return this.draftBills().map(bill => {
  //     runningTotal += bill.totalAmount;
  //     return { ...bill, cumulativeTotal: runningTotal };
  //   });
  // });

  editBill(bill: Bill): Bill {

    this.router.navigate(['/create-bill'], { state: { bill } });
    debugger;
    return bill;
  }

  deleteDraft(id: string) {

    this.billService.deleteBill(id);
  }

  submitBill(bill: Bill) {
    this.billService.updateBill({ ...bill, status: 'pending' });
    this.router.navigate(['/success']);
  }



}
