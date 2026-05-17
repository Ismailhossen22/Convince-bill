import { Component, computed, inject, numberAttribute, signal } from '@angular/core';
import { Bill, BillStatus, BillStatusName, IApprovalDetail, IConvenceBill } from '../../models/bill.mode';
import { BillService } from '../../services/bill.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/services/AuthService';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, single } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-approval-history',
  imports: [FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './approval-history.html',
  styleUrl: './approval-history.css',
})
export class ApprovalHistory {

  private billService = inject(BillService);
  private readonly AuthService = inject(AuthService);
  private router = inject(Router);
  selectedDate = signal<string>('');
  draftBills = this.billService.draftBills;

  private fb = inject(FormBuilder);
  billSignal = signal<Bill[]>([]);
  approvebill = signal<IApprovalDetail[]>([]);

  filterForm!: FormGroup;

  ngOnInit() {
    this.initializeForm();
    this.loadApproval();
  }

  CurrentUsr = this.AuthService.currentUser;


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
      uid: [],
    });
    this.loadApproval();
  }

  loadApproval() {
    debugger;
    const { fromDate, toDate, userRole, statusId, uid } = this.filterForm.value;

    this.billService.getApproval(fromDate, toDate, userRole, statusId, uid).subscribe({
      next: (res: any) => {
        console.log('Approval Bill Response:', res);

        const eventData = res?.event?.eventData || [];
        const messageData = eventData.find((item: any) => item.key === 'message');

        if (messageData && Array.isArray(messageData.value)) {
          const rawData = messageData.value;

          const mappedData: IApprovalDetail[] = rawData.map((item: any) => ({
            
            convID: Number(item.convID),
            convOwnerUID: Number(item.convOwnerUID),
            personId: Number(item.personId),
            personName: item.personName || 'Unknown',
            submissionDate: item.submissionDate,
            approvalDate: item.approvalDate,
            totalAmount: Number(item.totalAmount) || 0,
          }));

          this.approvebill.set(mappedData);

          console.log('Mapped Data:', mappedData);
        } else {
          this.billSignal.set([]);
        }
      },
      error: (err) => {
        console.error('Error fetching details:', err);
        this.billSignal.set([]);
      },
    });
  }

  calculateTotalAmount = computed(() =>
    this.draftBills().reduce((sum, bill) => sum + (bill.totalAmount ?? 0), 0),
  );

  goToDetails(date: string, uid: number) {
    debugger;
    this.router.navigate(['/approval-details'], {
      queryParams: {
        submissionDate: date,
        filteredUID: uid,
      },
    });
  }

  statusOptions = Object.entries(BillStatusName)
    .filter(([key, value]) => typeof value === 'number') // শুধু নম্বর ভ্যালুগুলো নিবে
    .map(([key, value]) => ({
      label: key
      , value: value
    }));


  searchText = signal('')
  selectedStatus = signal<number | null>(null)

  fillteredBill = computed<IApprovalDetail[]>(() => {
    let allbill = this.approvebill();

    if (this.searchText()) {
      allbill = allbill.filter(item => item.personName?.toLowerCase().includes(this.searchText().toLowerCase()));
    }

    // if(this.selectedStatus()!==null){
    //   allbill=allbill.filter(item=>item.)
    // }


    return allbill
  })

  currentpage = signal(1)
  pageSize = 5


  paginatedBills = computed<IApprovalDetail[]>(() => {

    const startIndex = (this.currentpage() - 1) * this.pageSize;
    return this.fillteredBill().slice(startIndex, startIndex + this.pageSize)
  })

  totalPage = computed<number>(() =>
    Math.ceil(this.fillteredBill().length / this.pageSize))

  changePage(page: number) {
    this.currentpage.set(page)
  }

}
