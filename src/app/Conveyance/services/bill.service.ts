// services/bill.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bill } from '../models/bill.mode';


@Injectable({ providedIn: 'root' })
export class BillService {

  private bills: Bill[] = [];
  private billsSubject = new BehaviorSubject<Bill[]>([]);
  bills$ = this.billsSubject.asObservable();

  // Bill জমা দেওয়া
  submitBill(bill: Bill) {
    bill.id = 'CB-' + Date.now();
    bill.billNo = 'CB-2026-' + Math.floor(Math.random() * 1000);
    bill.status = 'pending';
    this.bills.push(bill);
    this.billsSubject.next(this.bills);
  }

  // Draft save করা
  saveDraft(bill: Bill) {
    bill.status = 'draft';
    this.bills.push(bill);
    this.billsSubject.next(this.bills);
  }

  // Status অনুযায়ী bill আনা
  getBillsByStatus(status: string): Bill[] {
    return this.bills.filter(b => b.status === status);
  }

  // Bill approve করা
  approveBill(billId: string) {
    const bill = this.bills.find(b => b.id === billId);
    if (bill) bill.status = 'approved';
    this.billsSubject.next(this.bills);
  }

  // Bill reject করা
  rejectBill(billId: string, reason: string) {
    const bill = this.bills.find(b => b.id === billId);
    if (bill) {
      bill.status = 'rejected';
      bill.rejectionReason = reason;
    }
    this.billsSubject.next(this.bills);
  }

  getAllBills(): Bill[] {
    return this.bills;
  }
}