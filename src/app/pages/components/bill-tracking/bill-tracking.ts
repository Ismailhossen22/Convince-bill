import { Component, computed, inject, signal } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { DatePipe } from '@angular/common';
import { Bill, BillStatus, BillStatusName, IConvenceBill } from '../../models/bill.mode';
import { computeMsgId } from '@angular/compiler';

@Component({
  selector: 'app-bill-tracking',
  imports: [DatePipe],
  templateUrl: './bill-tracking.html',
  styleUrl: './bill-tracking.css',
})
export class BillTracking {

  public billServece = inject(BillService)
  public billdata = this.billServece.billSignal;


  searchTerm = signal('')
  thisMonthOnly = signal(false);
  selectedStatus = signal<number | null>(null);
  currentPage = signal(1)
  pageSize = 5

  filteredBills = computed<IConvenceBill[]>(() => {
    let allBills = this.billdata().flatMap(bill => bill.items);

    if (this.searchTerm()) {
      allBills = allBills.filter(item =>
        item.companyName
          ?.toLowerCase()
          .includes(this.searchTerm().toLowerCase())
      );
    }

    if (this.selectedStatus() !== null) {
      allBills = allBills.filter(
        item => item.currentStatus === this.selectedStatus()
      );
    }



    if (this.thisMonthOnly()) {
      const now = new Date();

      allBills = allBills.filter(item => {
        if (!item.visitedDate) return false

        const date = new Date(item.visitedDate);

        return (
          date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        )
      })
    }

    return allBills;
  });

  filterThisMonth(): void {
    this.thisMonthOnly.set(!this.thisMonthOnly());
    this.currentPage.set(1);
  }

  getStatusName(statusId: number): string {

    const statusName = BillStatusName[statusId]
    return statusName
  }



  paginatedBills = computed<IConvenceBill[]>(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredBills().slice(start, start + this.pageSize);
  });

  totalPages = computed<number>(() =>
    Math.ceil(this.filteredBills().length / this.pageSize)
  );

  changePage(page: number) {
    this.currentPage.set(page);
  }

  filterStatus(status: number | null) {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
  }


  statusOptions = Object.entries(BillStatusName)
    .filter(([key, value]) => typeof value === 'number') // শুধু নম্বর ভ্যালুগুলো নিবে
    .map(([key, value]) => ({
      label: key
      , value: value
    }));








}
