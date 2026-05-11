import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-success-page',
  imports: [],
  templateUrl: './success-page.html',
  styleUrl: './success-page.css',
})
export class SuccessPage {


  summaryData = input({
    billId: 'CB-2024-015',
    date: 'January 18, 2024',
    employeeName: 'Md. Aftahi Islam Nayan',
    totalEntries: '6',
    period: 'Jan 1 - Jan 6, 2024',
    amount: '240'
  });

  // Output Signals
  onCreateNew = output<void>();
  onTrackStatus = output<void>();

  createNew() {
    this.onCreateNew.emit();
  }

  trackStatus() {
    this.onTrackStatus.emit();
  }
}
