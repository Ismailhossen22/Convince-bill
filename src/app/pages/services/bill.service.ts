// services/bill.service.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Bill, BillStatus, IConvenceBill } from '../models/bill.mode';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })


export class BillService {


  private readonly http = inject(HttpClient)

  // private apiUrl = 'json/convence-bill.json';
  private apiUrl = 'http://localhost:3000/bills';
  private billSignalCreate = signal<IConvenceBill[]>([]);
  private billSignal = signal<Bill[]>([]);
  constructor() {
    this.loadBills();
  }

  loadBills() {
    this.http.get<IConvenceBill[]>(this.apiUrl).subscribe({
      next: (data: IConvenceBill[]) => {
        if (!data || data.length == 0) {
          this.billSignal.set([])
          return;
        }

        const groupedByStatus = data.reduce((acc, item) => {

          const statusValue = item.status;
          if (!acc[statusValue]) {
            acc[statusValue] = [];
          }
          acc[statusValue].push(item)
          return acc
        }, {} as Record<number, IConvenceBill[]>)

        const transformedBill: Bill[] = Object.keys(groupedByStatus).map(statusKey => {

          const nummericStatus = Number(statusKey)
          const items = groupedByStatus[nummericStatus]

          return {
            items: items,
            totalAmount: items.reduce((sum, item) => sum + item.amount, 0),
            comments: '',
          }
        });
          console.log(transformedBill);
        this.billSignal.set(transformedBill)

      }, error: (err) => {
        console.error('API থেকে ডাটা লোড করতে সমস্যা হয়েছে:', err)
      }

    });
  }

  // updateBillApi(bill: IConvenceBill): Observable<IConvenceBill> {
  //   return this.http.put<IConvenceBill>(`${this.apiUrl}/${bill.convID}`, bill);
  // }

  AddBillApi(bill: IConvenceBill): Observable<IConvenceBill> {
    return this.http.post<IConvenceBill>(this.apiUrl, bill);
  }

  updateBillApi(bill: IConvenceBill): Observable<IConvenceBill> {
    const url = `${this.apiUrl}/${bill.convID}`;
    return this.http.put<IConvenceBill>(url, bill);
  }






  draftBills = computed(() =>
    this.billSignal().filter(b => b.items.length > 0 && b.items[0].status === BillStatus.DRAFT)
  );
  pendingBills = computed(() =>
    this.billSignal().filter(b => b.items.length > 0 && b.items[0].status === BillStatus.PENDING));

  rejectedBills = computed(() =>
    this.billSignal().filter(b => b.items.length > 0 && b.items[0].status === BillStatus.REJECTED));
  approvedBills = computed(() =>
    this.billSignal().filter(b => b.items.length > 0 && b.items[0].status === BillStatus.APPROVED));


  allBills = computed(() => this.billSignal());

  saveDraft(bill: Bill) {

    this.billSignal.update(bills => [...bills, bill]);
  }



  submitBill(bill: Bill) {

    this.billSignal.update(bills => [...bills, bill]);
  }


  updateBill(updatedBill: IConvenceBill) {
    this.billSignalCreate.update(bills =>
      bills.map(item =>
        item.convID === updatedBill.convID ? updatedBill : item
      )
    );
  }

  approveBill(convID: string) {
    this.billSignal.update(bills =>
      bills.map(b => {

        if (b.items.length > 0 && b.items[0].convID === convID) {


          const updatedItems = b.items.map(item => ({ ...item, status: 1 }));

          return { ...b, items: updatedItems };
        }
        return b;
      })
    );
  }


  rejectBill(convID: string, reason: string) {
    this.billSignal.update(bills =>
      bills.map(b => {

        if (b.items.length > 0 && b.items[0].convID === convID) {


          const updatedItems = b.items.map(item => ({ ...item, status: 2 }));

          return {
            ...b,
            items: updatedItems,
            rejectionReason: reason
          };
        }
        return b;
      })
    );
  }


  deleteBill(convID: string) {
    this.billSignal.update(bills =>
      bills.filter(b => b.items.length > 0 && b.items[0].convID !== convID)
    );
  }



  // getAllBills(): Bill[] {
  //   return this.billSignal();

  // }

  getUserData(userId: string) {
    return this.http.get<any>(
      `https://api.example.com/user/${userId}`
    );
  }










}











