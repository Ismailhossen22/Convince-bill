import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BillService } from '../../services/bill.service';
import { Bill, IApprovalDetail, IConvenceBill } from '../../models/bill.mode';
import { ShortDatePipe } from '../../pipes/short-data.pipe';
import { AuthService } from '../../../features/services/AuthService';
import { from } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-approval-dashboard',
  imports: [ReactiveFormsModule,FormsModule,DatePipe],
  templateUrl: './approval-dashboard.html',
  styleUrl: './approval-dashboard.css',
})
export class ApprovalDashboard implements OnInit {

  private billService = inject(BillService);
  private readonly AuthService = inject(AuthService)
  private router = inject(Router)
  selectedDate = signal<string>('');
  draftBills = this.billService.draftBills;

  private fb = inject(FormBuilder)
  billSignal = signal<Bill[]>([]);
    approvebill = signal<IApprovalDetail[]>([]);

  filterForm!: FormGroup


  ngOnInit() {

    this.initializeForm()
    this.loadApproval()
    
   // this.loadApprovalDetails();

  }

  CurrentUsr = this.AuthService.currentUser;

  // filteredApprovedBills = computed(() => {
  //   const date = this.selectedDate();
  //   const allBills = this.billSignal();
  //   if (!date) return allBills;

  //   return allBills.filter(bill =>
  //     bill.items.some(item => item.visitedDate?.startsWith(date))
  //   );
  // });




  private initializeForm() {

    const today = new Date();
    const toDateStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);
    const fromDateStr = lastYear.toISOString().split('T')[0]; // Format: YYYY-MM-DD


    this.filterForm = this.fb.group({
      fromDate: [fromDateStr],
      toDate: [toDateStr],
      statusId: [],
      userRole: [''],
      uid: []
    })
    this.loadApproval()
  }

  loadApproval() {
    const { fromDate, toDate, userRole, statusId, uid } = this.filterForm.value;

    this.billService.getApproval(fromDate, toDate, userRole, statusId, uid).subscribe({
      next: (res: any) => {
        console.log('Approval Bill Response:', res);

        const eventData = res?.event?.eventData || [];
        const messageData = eventData.find((item: any) => item.key === 'message');

        if (messageData && Array.isArray(messageData.value)) {
          const rawData = messageData.value;

          const mappedData: IApprovalDetail[] = rawData.map((item: any) => ({
            approvalDate: item.approvalDate || null,
            convID: Number(item.convID),
            convOwnerUID: Number(item.convOwnerUID),
            personId: Number(item.personId),
            personName: item.personName || 'Unknown',
            submissionDate: item.submissionDate,
            totalAmount: Number(item.totalAmount) || 0
          }));


          this.approvebill.set(mappedData);

          console.log("Mapped Data:", mappedData);
        } else {

          this.billSignal.set([]);
        }
      },
      error: (err) => {
        console.error('Error fetching details:', err);
        this.billSignal.set([]);
      }
    });
  }






  loadApprovalDetails() {
    const date = '2026-05-11';
    const uid = 101;
    const role = 'AdminExecutiveUser';
    const status = 3;

    this.billService.getApprovalDetails(date, uid, role, status).subscribe({
      next: (data: any) => {
        console.log('Approval Details:', data);

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
          userRole: role,
          currentStatus: item.currentStatus
        }));


        const total = mappedItems.reduce((sum, item) => sum + (item.amount ?? 0), 0);
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
