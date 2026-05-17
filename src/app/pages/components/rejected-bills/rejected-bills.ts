import { Component, computed, inject, signal } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { BillStatus, IConvenceBill } from '../../models/bill.mode';
import { Router } from '@angular/router';
import { ShortDatePipe } from '../../pipes/short-data.pipe';


@Component({
  selector: 'app-rejected-bills',
  imports: [ShortDatePipe],
  templateUrl: './rejected-bills.html',
  styleUrl: './rejected-bills.css',
})
export class RejectedBills {


  private billService = inject(BillService);

  private router = inject(Router)

  rejectBill = this.billService.rejectedBills;

  calculateTotalAmount = computed(() =>
    this.rejectBill().reduce((sum, bill) => sum + (bill.totalAmount ?? 0), 0)
  );


  editSingleItem(item: IConvenceBill) {
    debugger;
    this.router.navigate(['/create-bill'], { state: { billData: item } });
  }

  deleteBill(convID: number, ctid: number) {
    debugger;

    if (confirm("Are you sure want to delete this bill?")) {
      this.billService.deleteBill(convID, ctid).subscribe({
        next: () => {
          alert('Deleted successfully!')
        }, error: (err) => console.error(err)
      })
    }
  }

  selectedConvID = signal<number[]>([]);

  submittoSupervisor(convId: number) {
    this.selectedConvID.update(ids => [...ids, convId])
    const convIdsArray = this.selectedConvID()
    const currentStatus = BillStatus.Draft;
    const nextStatus = BillStatus.SentToAdminExecutive;
    const comment = '';
    const actionUId=BillStatus.Draft
      debugger;
    this.billService.updateBillStatus(convIdsArray, actionUId, currentStatus, nextStatus, comment, ).subscribe({
      next: (res) => {



        this.billService.billSignal.update((bills) => {
          return bills
            .map((bill) => ({
              ...bill,

              items: bill.items.filter((item) => !convIdsArray.includes(item.convID))
            }))

            .filter((bill) => bill.items.length > 0);
        });
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Error updating status');
      }
    });
  }


}
