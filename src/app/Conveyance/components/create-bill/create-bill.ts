
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillService } from '../../services/bill.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-create-bill',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './create-bill.html',
  styleUrl: './create-bill.css',
})
export class CreateBill {

form: FormGroup;
  isHoliday = false;

  transportModes = ['CNG', 'Uber', 'Bus', 'Own Vehicle'];
  purposes = ['Client Meeting', 'Office Work', 'Field Visit'];

  constructor(
    private fb: FormBuilder,
    private billService: BillService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name:        ['Md. Afsob Islam Nayan'],
      department:  ['ICT Dept.', Validators.required],
      designation: [''],
      dateFrom:    ['', Validators.required],
      dateTo:      ['', Validators.required],
      items: this.fb.array([this.createItem()])
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      visitedDate:     ['', Validators.required],
      from:            ['', Validators.required],
      to:              ['', Validators.required],
      distance:        [0],
      globalCompany:   [''],
      purpose:         [''],
      modeOfTransport: [''],
      amount:          [0, Validators.required]
    });
  }

  addRow() { this.items.push(this.createItem()); }

  removeRow(i: number) { this.items.removeAt(i); }

  get totalAmount(): number {
    return this.items.controls
      .reduce((sum, c) => sum + (+c.get('amount')?.value || 0), 0);
  }

  checkHoliday(date: string) {
    const day = new Date(date).getDay();
    this.isHoliday = day === 5 || day === 6; // শুক্র/শনি
  }

  saveDraft() {
    this.billService.saveDraft({
      ...this.form.value,
      totalAmount: this.totalAmount,
      status: 'draft',
      submissionDate: new Date().toISOString(),
      travelDays: this.items.length,
      dateRange: `${this.form.value.dateFrom} - ${this.form.value.dateTo}`
    });
    this.router.navigate(['/draft-bills']);
  }

  submitToSupervisor() {
    if (this.form.valid) {
      this.billService.submitBill({
        ...this.form.value,
        totalAmount: this.totalAmount,
        status: 'pending',
        submissionDate: new Date().toISOString(),
        travelDays: this.items.length,
        dateRange: `${this.form.value.dateFrom} - ${this.form.value.dateTo}`
      });
      this.router.navigate(['/success']);
    }
  }


}

