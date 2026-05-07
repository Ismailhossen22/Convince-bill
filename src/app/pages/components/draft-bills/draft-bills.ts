
import { Component, computed, inject } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { Router } from '@angular/router';
import { IConvenceBill } from '../../models/bill.mode';
import { ShortDatePipe } from '../../pipes/short-data.pipe';

@Component({
  selector: 'app-draft-bills',
  imports: [ShortDatePipe],
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

  editSingleItem(item: IConvenceBill) {
    this.router.navigate(['/create-bill'], { state: { billData: item } });
  }

  deleteBill(Id: string) {
    debugger;
    if (confirm("Are you sure want to delete this bill?")) {
      this.billService.deleteBill(Id).subscribe({
        next: () => {
          alert('Deleted successfully!')
        }, error: (err) => console.error(err)
      })
    }
  }

  // submitBill(bill: Bill) {
  //   this.billService.updateBill({ ...bill, status: 2 });
  //   this.router.navigate(['/success']);
  // }



}
