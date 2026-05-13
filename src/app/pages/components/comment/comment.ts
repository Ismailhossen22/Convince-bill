import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, input, Input, output, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IConvenceBill } from '../../models/bill.mode';

@Component({
  selector: 'app-comment',
  imports: [FormsModule, ReactiveFormsModule, DatePipe, CommonModule],
  templateUrl: './comment.html',
  styleUrl: './comment.css',
})
export class Comment {

  selectedBills = input.required<IConvenceBill[]>();

  close = output<void>();
  submit = output<string>();

 
  rejectReason = signal<string>('');

  onCancel() {
    this.close.emit();
  }

  onSubmit() {

    if (this.rejectReason().trim()) {
      this.submit.emit(this.rejectReason());
    } else {
      alert("Please provide a reason!");
    }
  }

}
