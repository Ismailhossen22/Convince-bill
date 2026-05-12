import { Component, inject, OnInit, signal } from '@angular/core';
import { Bill, IApprovalDetail, IConvenceBill } from '../../models/bill.mode';
import { BillService } from '../../services/bill.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-monthly-report',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './monthly-report.html',
  styleUrl: './monthly-report.css',
})
export class MonthlyReport implements OnInit {

  private billService = inject(BillService)
  private fb = inject(FormBuilder)
  billSignal = signal<IApprovalDetail[]>([]);

  filterForm!: FormGroup

  ngOnInit(): void {
    this.initializeForm()
    this.loadApprovalDetails()
  }

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
    this.loadApprovalDetails()
  }

  loadApprovalDetails() {
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


          this.billSignal.set(mappedData);

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





}