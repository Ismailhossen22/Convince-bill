
import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { Router } from '@angular/router';
import { IConvenceBill } from '../../models/bill.mode';
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
    this.getDraftBills()

  }

  getDraftBills() {
    const user = this.AuthService.currentUser;
    const userId = 101;

    if (!userId) return;

    const url = `${this.getBillTrackingUrl}?ConvOwnerUID=${userId}`;
    console.log('Final URL:', url);


    this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log('Full Response:', res);


        const billsArray = res?.event?.eventData?.[0]?.value;

        if (billsArray && billsArray.length > 0) {
          console.log('আসল বিলের ডাটা পাওয়া গেছে:', billsArray);

        } else {
          console.warn('সার্ভার থেকে রেসপন্স আসছে কিন্তু বিলের লিস্ট (value) খালি।');
          this.billService.billSignal.set([]);
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
      }
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

  // submitBill(bill: Bill) {
  //   this.billService.updateBill({ ...bill, status: 2 });
  //   this.router.navigate(['/success']);
  // }



}
