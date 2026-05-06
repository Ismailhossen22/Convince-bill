// services/bill.service.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bill } from '../models/bill.mode';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })


export class BillService {



  private billSignal = signal<Bill[]>([]);

  draftBills = computed(() =>
    this.billSignal().filter(b => b.status === 'draft'));

  pendingBills = computed(() =>
    this.billSignal().filter(b => b.status === 'pending'));

  rejectedBills = computed(() =>
    this.billSignal().filter(b => b.status === 'rejected'));

  allBills = computed(() => this.billSignal());

  saveDraft(bill: Bill) {
    bill.id = 'CB-' + Date.now();
    bill.status = 'draft';

    this.billSignal.update(bills => [...bills, bill]);
  }



  submitBill(bill: Bill) {
    bill.id = 'CB-' + Date.now();
    bill.status = 'pending';
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
        b.id === id ? { ...b, status: 'approved' } : b
      )
    );
  }

  rejectBill(id: string, reason: string) {
    this.billSignal.update(bills =>
      bills.map(b =>
        b.id === id
          ? {
            ...b, status: 'rejected',
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











