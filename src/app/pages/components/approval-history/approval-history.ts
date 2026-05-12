import { Component, computed, inject, signal } from '@angular/core';
import { Bill, IConvenceBill } from '../../models/bill.mode';
import { BillService } from '../../services/bill.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/services/AuthService';
import { ShortDatePipe } from '../../pipes/short-data.pipe';

@Component({
  selector: 'app-approval-history',
  imports: [],
  templateUrl: './approval-history.html',
  styleUrl: './approval-history.css',
})
export class ApprovalHistory {

  private billService = inject(BillService);
  private readonly AuthService = inject(AuthService)
  private router = inject(Router)
  selectedDate = signal<string>('');
  draftBills = this.billService.draftBills;
  billSignal = signal<Bill[]>([]);

  ngOnInit() {
    this.loadData();
  }

  CurrentUsr = this.AuthService.currentUser;

  filteredApprovedBills = computed(() => {
    const date = this.selectedDate();
    const allBills = this.billSignal();
    if (!date) return allBills;

    return allBills.filter(bill =>
      bill.items.some(item => item.visitedDate?.startsWith(date))
    );
  });


  loadData() {
    this.billService.getBills().subscribe({
      next: (transformedData) => {
        debugger;
        this.billSignal.set(transformedData);
      },
      error: (err) => console.error(err)
    });
  }



  calculateTotalAmount = computed(() =>
    this.draftBills().reduce((sum, bill) => sum + (bill.totalAmount ?? 0), 0)
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

  // deleteBill(Id: string) {
  //   debugger;
  //   if (confirm("Are you sure want to delete this bill?")) {
  //     this.billService.deleteBill(Id).subscribe({
  //       next: () => {
  //         alert('Deleted successfully!')
  //       }, error: (err) => console.error(err)
  //     })
  //   }
  // }

  // submitBill(bill: Bill) {
  //   this.billService.updateBill({ ...bill, status: 2 });
  //   this.router.navigate(['/success']);
  // }

}
