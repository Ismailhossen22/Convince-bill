
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillService } from '../../services/bill.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Bill, BillItem } from '../../models/bill.mode';


@Component({
  selector: 'app-create-bill',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-bill.html',
  styleUrl: './create-bill.css',
})
export class CreateBill implements OnInit {

  
  private readonly fb          = inject(FormBuilder);
  private readonly billService = inject(BillService);
  private readonly router      = inject(Router);

  form!: FormGroup;

  // ✅ Signals
  isHoliday    = signal<boolean>(false);
  isEditMode   = signal<boolean>(false);
  editingBill  = signal<Bill | null>(null);
  isSubmitting = signal<boolean>(false);

  // ✅ Items signal — table bind এর জন্য
  itemsSignal  = signal<any[]>([]);

  // ✅ Computed — total auto calculate
  totalAmount  = computed(() =>
    this.itemsSignal().reduce(
      (sum, item) => sum + (+item.amount || 0), 0
    )
  );

  transportModes = ['CNG', 'Uber', 'Bus', 'Own Vehicle'];
  purposes       = ['Client Meeting', 'Office Work', 'Field Visit'];

  constructor() {
    this.buildForm();
  }

  ngOnInit(): void {
    
    const navigation = this.router.getCurrentNavigation();
    const bill = navigation?.extras?.state?.['bill'] as Bill;

    if (bill) {
      this.isEditMode.set(true);
      this.editingBill.set(bill);
     // this.loadBillData(bill);
    }

    // ✅ FormArray change হলে signal update
    this.items.valueChanges.subscribe(val => {
      this.itemsSignal.set(val);
    });

    // Initial set
    this.itemsSignal.set(this.items.value);
  }

  // ✅ Form build
  private buildForm(): void {
    this.form = this.fb.group({
      name:        ['Md. Afsob Islam Nayan'],
      department:  ['ICT Dept.', Validators.required],
      designation: [''],
      dateFrom:    ['', Validators.required],
      dateTo:      ['', Validators.required],
      items:       this.fb.array([this.createItem()])
    });
  }

  // ✅ FormArray getter
  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get itemGroups(): FormGroup[] {
    return this.items.controls as FormGroup[];
  }

  // ✅ Item তৈরি
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

  addRow(): void {
    this.items.push(this.createItem());
  }

  removeRow(i: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(i);
    }
  }

  // ✅ Holiday check — signal দিয়ে
  checkHoliday(event: Event): void {
    const date  = (event.target as HTMLInputElement).value;
    const day   = new Date(date).getDay();
    this.isHoliday.set(day === 5 || day === 6);
  }

  // ✅ Draft থেকে এলে form এ data বসানো
  // private loadBillData(bill: Bill): void {
  //   this.form.patchValue({
  //     name:        bill.name,
  //     department:  bill.department,
  //     designation: bill.designation,
  //     dateFrom:    bill.dateFrom,
  //     dateTo:      bill.dateTo
  //   });

  //   this.items.clear();
  //   bill.items?.forEach(item => {
  //     this.items.push(this.fb.group(item));
  //   });

  //   this.itemsSignal.set(this.items.value);
  // }

  // ✅ Build bill object — DRY
  private buildBillPayload(status: 'draft' | 'pending'): Bill {
    return {
      ...this.form.value,
      totalAmount:      this.totalAmount(), // signal call
      status,
      submissionDate:   new Date().toISOString(),
      travelDays:       this.items.length,
      dateRange:        `${this.form.value.dateFrom} -
                         ${this.form.value.dateTo}`
    };
  }

  // ✅ Save Draft
  saveDraft(): void {
    const payload = this.buildBillPayload('draft');

    if (this.isEditMode() && this.editingBill()) {
      // Edit mode — update করা
      this.billService.updateBill({
        ...payload,
        id: this.editingBill()!.id
      });
    } else {
      // New draft
      this.billService.saveDraft(payload);
    }

    this.router.navigate(['/draft-bills']);
  }

  // ✅ Submit to Supervisor
  submitToSupervisor(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const payload = this.buildBillPayload('pending');

    if (this.isEditMode() && this.editingBill()) {
      this.billService.updateBill({
        ...payload,
        id: this.editingBill()!.id
      });
    } else {
      this.billService.submitBill(payload);
    }

    this.isSubmitting.set(false);
    this.router.navigate(['/success']);
  }

  // ✅ Form reset
  resetForm(): void {
    this.form.reset();
    this.items.clear();
    this.items.push(this.createItem());
    this.itemsSignal.set(this.items.value);
    this.isHoliday.set(false);
    this.isEditMode.set(false);
    this.editingBill.set(null);
  }





}

