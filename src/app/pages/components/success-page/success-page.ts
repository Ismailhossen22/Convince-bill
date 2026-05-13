import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-success-page',
  imports: [],
  templateUrl: './success-page.html',
  styleUrl: './success-page.css',
})
export class SuccessPage {
summaryData = input.required<any>();

  // অ্যাকশন পাঠানোর জন্য output signal
  onCreateNew = output<void>();
  onTrackStatus = output<void>();

  createNew() {
    this.onCreateNew.emit();
  }

  trackStatus() {
    this.onTrackStatus.emit();
  }





}
