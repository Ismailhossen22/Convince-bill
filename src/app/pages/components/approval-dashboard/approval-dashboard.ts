import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BillService } from '../../services/bill.service';
import { Bill, IConvenceBill } from '../../models/bill.mode';
import { ShortDatePipe } from '../../pipes/short-data.pipe';
import { AuthService } from '../../../features/services/AuthService';
import { from } from 'rxjs';

@Component({
  selector: 'app-approval-dashboard',
  imports: [],
  templateUrl: './approval-dashboard.html',
  styleUrl: './approval-dashboard.css',
})
export class ApprovalDashboard implements OnInit {

  private billService = inject(BillService);
  private readonly AuthService = inject(AuthService)
  private router = inject(Router)
  selectedDate = signal<string>('');
  draftBills = this.billService.draftBills;
  billSignal = signal<Bill[]>([]);

  ngOnInit() {
    //this.loadData();
    this.loadApprovalDetails()
  }

  CurrentUsr = this.AuthService.currentUser;

  filteredApprovedBills = computed(() => {
    const date = this.selectedDate();
    const allBills = this.billSignal();
    if (!date) return allBills;

    return allBills.filter(bill =>
      bill.items.some(item => item.visitedDate.startsWith(date))
    );
  });



  loadApprovalDetails() {
    const from = "2026-05-09";
    const to = "2026-05-11";
    const userRole = "admin";
    const statusId = 3;
    const uid = "101";

    this.billService.getApproval(from, to, userRole, statusId, uid).subscribe({
      next: (data: any) => {
        console.log('Approval Bill:', data);

        const rawItems = data.message || [];


        const mappedItems: IConvenceBill[] = rawItems.map((item: any) => ({
          visitedDate: item.visitedDate,
          toLocation: item.toLocation,
          fromLocation: item.fromLocation,
          purpose: item.purpose,
          transportMode: item.transportMode,
          companyName: item.companyName,
          userId: item.userId,
          amount: item.amount,
          status: item.status,
          convID: item.convID || "",
          userRole: item.Role,
          currentStatus: item.currentStatus
        }));


        const total = mappedItems.reduce((sum, item) => sum + item.amount, 0);
        const finalBill: Bill = {
          totalAmount: total,
          subtotal: total,
          items: mappedItems,
          comments: "",
          rejectReason: ""
        };


        this.billSignal.set([finalBill]);
      },
      error: (err) => console.error('Error fetching details:', err)
    });


  }












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
