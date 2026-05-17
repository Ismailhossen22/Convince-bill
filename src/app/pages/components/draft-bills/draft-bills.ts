
import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { Router } from '@angular/router';
import { BillStatus, IConvenceBill } from '../../models/bill.mode';
import { ShortDatePipe } from '../../pipes/short-data.pipe';
import { AuthService } from '../../../features/services/AuthService';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-draft-bills',
  imports: [ShortDatePipe],
  templateUrl: './draft-bills.html',
  styleUrl: './draft-bills.css',
})
export class DraftBills implements OnInit {

  private billService = inject(BillService);
  private AuthService = inject(AuthService)
  private http = inject(HttpClient)
  getBillTrackingUrl: string = 'https://localhost:7226/Conveyance/GetBillTracking';

  private router = inject(Router)

  draftBills = this.billService.draftBills;

  constructor() {
    effect(() => {

      this.draftBills()
    })
  }

  ngOnInit(): void {

    this.billService.loadBills()
  }

  // getDraftBills() {
  //   const user = this.AuthService.currentUser;
  //   const userId = 101;

  //   if (!userId) return;

  //   const url = `${this.getBillTrackingUrl}?ConvOwnerUID=${userId}`;



  //   this.http.get<any>(url).subscribe({
  //     next: (res) => {
  //       console.log('Full Response:', res);


  //       const billsArray = res?.event?.eventData?.[0]?.value;

  //       if (billsArray && billsArray.length > 0) {
  //       //  console.log('আসল বিলের ডাটা পাওয়া গেছে:', billsArray);

  //       } else {
  //         console.warn('সার্ভার থেকে রেসপন্স আসছে কিন্তু বিলের লিস্ট (value) খালি।');
  //         this.billService.billSignal.set([]);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('HTTP Error:', err);
  //     }
  //   });
  // }


  calculateTotalAmount = computed(() =>
    this.draftBills().reduce((sum, bill) => sum + (bill.totalAmount ?? 0), 0)
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


  submittoSupervisor() {

    const convIdsArray = this.billService.billSignal()
      .flatMap(bill => bill.items)
      .filter(item => item.status === 3)
      .map(item => item.convID);

    if (convIdsArray.length === 0) {
   
      return;
    }

    const currentStatus = BillStatus.Draft;
    const nextStatus = BillStatus.SentToAdminExecutive;
    const comment = '';
    const actionId=BillStatus.Draft

    this.billService.updateBillStatus(convIdsArray,actionId, currentStatus, nextStatus, comment).subscribe({
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
