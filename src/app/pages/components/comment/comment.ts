import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment',
  imports: [FormsModule,ReactiveFormsModule,DatePipe,CommonModule],
  templateUrl: './comment.html',
  styleUrl: './comment.css',
})
export class Comment {


  @Input() selectedBills: any[] = []; // অন্য কম্পোনেন্ট থেকে ডাটা আসবে
  @Output() close = new EventEmitter<void>();
  @Output() rejectSubmit = new EventEmitter<string>();

  rejectReason: string = '';

  closeModal() {
    this.close.emit();
  }

  submitReject() {
    if (this.rejectReason.trim()) {
      this.rejectSubmit.emit(this.rejectReason);
    } else {
      alert("Please provide a reason!");
    }
  }
}
