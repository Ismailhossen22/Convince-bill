// services/bill.service.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import {  Observable } from 'rxjs';
import { Bill, BillStatus, IConvenceBill } from '../models/bill.mode';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })


export class BillService {



 // private apiUrl = 'json/convence-bill.json';
 private apiUrl = 'http://localhost:3000/bills';


  getBills(): Observable<IConvenceBill[]> {
    return this.http.get<IConvenceBill[]>(this.apiUrl);
  }

  // updateBillApi(bill: IConvenceBill): Observable<IConvenceBill> {
  //   return this.http.put<IConvenceBill>(`${this.apiUrl}/${bill.convID}`, bill);
  // }

   updateBillApi(bill: IConvenceBill): Observable<IConvenceBill> {
    return this.http.post<IConvenceBill>(this.apiUrl, bill);
  }




  private billSignal = signal<Bill[]>([]);

  draftBills = computed(() =>
    this.billSignal().filter(b => b.status === BillStatus.DRAFT));

  pendingBills = computed(() =>
    this.billSignal().filter(b => b.status === BillStatus.PENDING));

  rejectedBills = computed(() =>
    this.billSignal().filter(b => b.status === BillStatus.REJECTED));
  approvedBills = computed(() =>
    this.billSignal().filter(b => b.status === BillStatus.APPROVED));


  allBills = computed(() => this.billSignal());

  saveDraft(bill: Bill) {
    bill.id = 'CB-' + Date.now();
    bill.status = BillStatus.DRAFT;

    this.billSignal.update(bills => [...bills, bill]);
  }



  submitBill(bill: Bill) {
    bill.id = 'CB-' + Date.now();
    bill.status = BillStatus.PENDING;
    this.billSignal.update(bills => [...bills, bill]);
  }

  updateBill(updatedBill: Bill) {
    this.billSignal.update(bills =>
      bills.map(b =>
        b.id === updatedBill.id ? updatedBill : b
      )
    );
  }
  deleteBill(id: string) {
    this.billSignal.update(bills =>
      bills.filter(b => b.id !== id)
    );
  }

  approveBill(id: string) {
    this.billSignal.update(bills =>
      bills.map(b =>
        b.id === id ? { ...b, status: BillStatus.APPROVED } : b
      )
    );
  }

  rejectBill(id: string, reason: string) {
    this.billSignal.update(bills =>
      bills.map(b =>
        b.id === id
          ? {
            ...b, status: BillStatus.REJECTED,
            rejectionReason: reason
          }
          : b
      )
    );
  }

  getAllBills(): Bill[] {
    return this.billSignal();

  }
  private readonly http = inject(HttpClient);
  getUserData(userId: string) {
    return this.http.get<any>(
      `https://api.example.com/user/${userId}`
    );
  }










}











