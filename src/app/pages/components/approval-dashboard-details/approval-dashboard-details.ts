import { Component, computed, Inject, inject, signal } from '@angular/core';
import { Bill, BillStatus, BillStatusName, IConvenceBill } from '../../models/bill.mode';
import { AuthService } from '../../../features/services/AuthService';
import { BillService } from '../../services/bill.service';
import { ShortDatePipe } from '../../pipes/short-data.pipe';
import { ActivatedRoute } from '@angular/router';
import { Comment } from "../comment/comment";
import { BillWorkflowService } from '../../services/bill-workflow.service';
import { CommonModule } from '@angular/common';
import { combineLatestWith } from 'rxjs';


@Component({
  selector: 'app-approval-dashboard-details',
  imports: [ShortDatePipe, Comment, CommonModule],
  templateUrl: './approval-dashboard-details.html',
  styleUrl: './approval-dashboard-details.css',
})
export class ApprovalDashboardDetails {

  private billService = inject(BillService);
  private readonly AuthService = inject(AuthService)
  private route = inject(ActivatedRoute)
  selectedDate = signal<string>('');
  draftBills = this.billService.draftBills;
  billSignal = signal<Bill[]>([]);
  selectedConvID = signal<number[]>([]);
  isRejectModalOpen = signal<boolean>(false);
  selectedBillsForModal = signal<IConvenceBill[]>([]);
  private workflowService = inject(BillWorkflowService)

  ngOnInit() {

    this.route.queryParamMap.subscribe(params => {
      const date = params.get('submissionDate');
      const uidParam = params.get('filteredUID');
      const uid = uidParam ? Number(uidParam) : undefined;


      debugger;
      if (date !== null) {
        this.loadApprovalDetails(date, uid);
      } else {
        console.error('Submission date is missing in the URL');
      }
    });

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

  loadApprovalDetails(date: string, uid?: number) {
    this.billService.getApprovalDetails(date, uid).subscribe({
      next: (res: any) => {
        console.log('Raw API Response:', res);

        const eventData = res?.event?.eventData || [];
        const messageData = eventData.find((item: any) => item.key === 'message');


        let mappedItems: IConvenceBill[] = [];

        if (messageData && Array.isArray(messageData.value)) {
          const rawData = messageData.value;
          mappedItems = rawData.map((item: any) => ({
            visitedDate: item.transportDate,
            toLocation: item.toLocation,
            fromLocation: item.fromLocation,
            purpose: item.transportPurpose,
            transportMode: item.transportMode,
            companyName: item.companyName,
            userId: item.personId,
            amount: item.transportCost,
            convID: item.convID,
            currentStatus: item.currentStatusId,
            name: item.personName
          }));
        }


        const total = mappedItems.reduce((sum, item) => sum + (item.amount ?? 0), 0);


        const finalBill: Bill = {
          totalAmount: total,
          subtotal: total,
          items: mappedItems,
          comments: "",
          rejectReason: ""
        };


        this.billSignal.set([finalBill]);

        console.log('Successfully Mapped Bill:', finalBill);
      },
      error: (err) => console.error('Error fetching details:', err)
    });
  }



  grandTotal = computed(() => {
    const bills = this.filteredApprovedBills();

    return bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
  });

  totalItemsCount = computed(() => {
    return this.billSignal().reduce((count, bill) => count + bill.items.length, 0);
  });




  pendingtStatus = signal<number>(0);

  processStatusUpdate(currentStatus: number,) {



    const slectedconvId = this.selectedConvID();
    if (slectedconvId.length === 0) {
      alert("Please select at least one bill!");
      return;
    }

    if (slectedconvId.length > 1) {
      alert("Please select only one bill at a time!");
      return;
    }

    if (!this.isActionAllowed) {
      alert("You are not permit bill approve")
      return;
    }

    this.pendingtStatus.set(currentStatus)
    const bills = this.billSignal().flatMap(b => b.items).filter(item => slectedconvId.includes(item.convID))
    this.selectedBillsForModal.set(bills)
    this.isRejectModalOpen.set(true)


  }

  get isActionAllowed(): boolean {
    return this.workflowService.canUserApprove(this.pendingtStatus())
  }


  handleFinalStatusUpdate(comment: string) {

    // const nextStatuss=this.workflowService.getNextStatus(this.pendingtStatus())
    debugger;
    const convIdsArray = this.selectedConvID();
    const currentStatus = this.pendingtStatus();
    const nextStatus = BillStatus.Rejected;
    const actionid = BillStatus.SentToAdminHead
    debugger;
    this.billService.updateBillStatus(convIdsArray, actionid, currentStatus, nextStatus, comment).subscribe({
      next: (res) => {
        debugger;
        alert('Status updated successfully!');
        this.isRejectModalOpen.set(false);
        this.selectedConvID.set([]);
        // this.loadApprovalDetails();  
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Error updating status');
      }
    });
  }


  approveBill() {
    debugger;

    if (!this.isActionAllowed) {
      alert('you are not permition bill approve')
      return;
    }

    const nextStatusId = this.workflowService.getNextStatus(this.pendingtStatus())
    if (nextStatusId) {

      console.log(`Sending update to backend. New Status ID: ${nextStatusId}`);
      const convIdsArray = this.selectedConvID();
      const currentStatus = this.pendingtStatus();
      const nextStatus = nextStatusId;
      const actionid = BillStatus.SentToAdminHead

      this.billService.updateBillStatus(convIdsArray, actionid, currentStatus, nextStatus,).subscribe({
        next: (res) => {
          debugger;
          console.log("bill update Successfull");
          this.selectedConvID.set([]);
          // this.loadApprovalDetails();  
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Error updating status');
        }
      });







    }
  }


  onCheckboxChange(convID: number, event: any) {
    const isChecked = event.target.checked;
    debugger;
    if (isChecked) {
      this.selectedConvID.update(ids => [...ids, convID])
    } else {
      this.selectedConvID.update(ids => ids.filter(id => id !== convID))
    }

  }
  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    debugger;
    if (isChecked) {
      const allIds = this.billSignal().flatMap(bill => bill.items.map(id => id.convID))
      this.selectedConvID.set(allIds)
    } else {
      this.selectedConvID.set([])
    }
  }

  isIdSelected(convID: number): boolean {
    return this.selectedConvID().includes(convID);
  }



}
