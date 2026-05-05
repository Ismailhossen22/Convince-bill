import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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

  editBill(bill: Bill): Bill {

    this.router.navigate(['/create-bill'], { state: { bill } });
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
