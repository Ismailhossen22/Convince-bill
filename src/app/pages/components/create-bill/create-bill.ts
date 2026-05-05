
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillService } from '../../services/bill.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Bill, UserData, } from '../../models/bill.mode';


@Component({
  selector: 'app-create-bill',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-bill.html',
  styleUrl: './create-bill.css',
})
export class CreateBill implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly billService = inject(BillService);
  private readonly router = inject(Router);
  isLoading = signal<boolean>(false);
  userInfo = signal<UserData | null>(null);
  usrform!: FormGroup;

  billItemsArray: FormArray = this.fb.array([this.createItem()]);


  isHoliday = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  editingBill = signal<Bill | null>(null);
  isSubmitting = signal<boolean>(false);


  itemsSignal = signal<any[]>([]);

  //  Computed — total auto calculate
  totalAmount = computed(() =>
    this.itemsSignal().reduce(
      (sum, item) => sum + (+item.amount || 0), 0
    )
  );

  transportModes = ['CNG', 'Uber', 'Bus', 'Own Vehicle'];
  purposes = ['Client Meeting', 'Office Work', 'Field Visit'];

  constructor() {
    this.UserForm();
  }

  ngOnInit(): void {
    this.UserForm();
    this.loadFromApi();
    const navigation = this.router.getCurrentNavigation();
    const bill = navigation?.extras?.state?.['bill'] as Bill;

    if (bill) {
      this.isEditMode.set(true);
      this.editingBill.set(bill);
      // this.loadBillData(bill);
    }

    //  FormArray change হলে signal update
    this.items.valueChanges.subscribe(val => {
      this.itemsSignal.set(val);
    });

    // Initial set
    this.itemsSignal.set(this.items.value);
  }


private UserForm(): void {
  this.usrform = this.fb.group({
    name:        ['Md. Afsob Islam Nayan'],
    contacNo:    ['01712345678'],
    designation: ['Director Technology and Product'],
    submitDate:  [new Date().toLocaleDateString('en-GB')], // ✅
  });
}

private loadFromApi(): void {
  this.isLoading.set(true);

  this.billService.getUserData('123').subscribe({
    next: (data) => {
      this.usrform.patchValue({
        name:        data.name,
        contacNo:    data.contacNo,
        designation: data.designation,
        submitDate:  data.submitDate  
      });

      this.userInfo.set(data);
      this.isLoading.set(false);
    },
    error: (err) => {
      console.error('Error:', err);
      this.isLoading.set(false);
    }
  });
}

  get items(): FormArray {
    return this.billItemsArray;
  }

  get itemGroups(): FormGroup[] {
    return this.billItemsArray.controls as FormGroup[];
  }


  createItem(): FormGroup {
    return this.fb.group({
      visitedDate: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      distance: [0],
      globalCompany: [''],
      purpose: [''],
      modeOfTransport: [''],
      amount: [0, Validators.required]
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
    const date = (event.target as HTMLInputElement).value;
    const day = new Date(date).getDay();
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
      ...this.billItemsArray.value,
      totalAmount: this.totalAmount(), // signal call
      status,
      submissionDate: new Date().toISOString(),
      travelDays: this.items.length,
      dateRange: `${this.billItemsArray.value.dateFrom} -  ${this.billItemsArray.value.dateTo}`

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
    if (this.billItemsArray.invalid) {
      this.billItemsArray.markAllAsTouched();
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
    this.billItemsArray.reset();
    this.items.clear();
    this.items.push(this.createItem());
    this.itemsSignal.set(this.items.value);
    this.isHoliday.set(false);
    this.isEditMode.set(false);
    this.editingBill.set(null);
  }





}

