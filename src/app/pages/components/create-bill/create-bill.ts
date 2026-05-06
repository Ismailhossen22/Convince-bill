
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BillService } from '../../services/bill.service';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Bill, BillItem, UserData, } from '../../models/bill.mode';
import { ShortDatePipe } from '../../pipes/short-data.pipe';
import { it } from 'node:test';


@Component({
  selector: 'app-create-bill',
  imports: [CommonModule, ReactiveFormsModule, ShortDatePipe],
  templateUrl: './create-bill.html',
  styleUrl: './create-bill.css',
})
export class CreateBill implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private readonly fb = inject(FormBuilder);
  private readonly billService = inject(BillService);
  private readonly router = inject(Router);
  isLoading = signal<boolean>(false);
  userInfo = signal<UserData | null>(null);
  usrform!: FormGroup;
  isHoliday = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  editingBill = signal<Bill | null>(null);
  isSubmitting = signal<boolean>(false);


  itemSignal = signal<any[]>([]);


  totalAmount = computed(() =>
    this.itemSignal().reduce(
      (sum, item) => sum + (+item.amount || 0), 0
    )
  );

  transportModes = ['CNG', 'Uber', 'Bus', 'Own Vehicle'];
  purposes = ['Client Meeting', 'Office Work', 'Field Visit'];

  private bill: Bill | null = null;
  constructor() {
    this.UserForm();

    const navigation = this.router.currentNavigation();
    this.bill = navigation?.extras?.state?.['bill'] as Bill;
  }

  ngOnInit(): void {
    this.UserForm();

    debugger;
    if (this.bill) {
      this.isEditMode.set(true);
      this.editingBill.set(this.bill);
      this.loadBillData(this.bill);
      
    }

    this.itemSignal.set(this.items.value);
    this.items.valueChanges.subscribe(val => {
      this.itemSignal.set(val);
    });

    if (isPlatformBrowser(this.platformId)) {
      this.loadFromApi();
    }

  }


  private UserForm(): void {
    this.usrform = this.fb.group({
      name: ['Md. Afsob Islam Nayan'],
      contacNo: ['01712345678'],
      designation: ['Director Technology and Product'],
      submitDate: [new Date().toLocaleDateString('en-GB')],
    });
    this.userInfo.set(this.usrform.value);
  }

  private loadFromApi(): void {
    this.isLoading.set(true);

    this.billService.getUserData('123').subscribe({
      next: (data) => {
        this.usrform.patchValue({
          name: data.name,
          contacNo: data.contacNo,
          designation: data.designation,
          submitDate: data.submitDate
        });

        this.userInfo.set(this.usrform.value);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading.set(false);
      }
    });
  }


  bilform: FormGroup = this.fb.group({
    billitem: this.fb.array([this.createItem()])
  });

  get items(): FormArray {
    return this.bilform.get('billitem') as FormArray;
  }


  createItem(): FormGroup {
    return this.fb.group({
      visitedDate: ['', [Validators.required, this.maxOneMonthValidator()]],
      fromLocation: ['', Validators.required],
      toLocation: ['', Validators.required],
      companyName: [''],
      purpose: [''],
      transportMode: [''],
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

  private loadBillData(bill: Bill): void {
    this.items.clear();
    bill.items?.forEach(item => {
      this.items.push(this.fb.group(item));
    });
    this.itemSignal.set(this.items.value);

  }

  // ✅ Build bill object — DRY
  private buildBillPayload(status: 'draft' | 'pending'): Bill {
    const items = this.items.value
    return {
      items: items,
      totalAmount: this.totalAmount(),
      status

    };
  }

  // ✅ Save Draft
  saveDraft(): void {
    if (this.bilform.invalid) {
      this.bilform.markAllAsTouched();
      return;
    }

    const payload = this.buildBillPayload('draft');
    this.billService.saveDraft(payload);
    this.router.navigate(['/draft-bills']);
  }

  // ✅ Submit to Supervisor
  submitToSupervisor(): void {
    if (this.items.invalid) {
      this.items.markAllAsTouched();
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


  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'short' }); // Jan, Feb...
    return `${day}-${month}`;
  }

  hasError(index: number, controlName: string, error: string): boolean {
    const control = this.items.at(index).get(controlName);

    return !!(control?.hasError(error) && (control?.touched || control?.dirty));
  }

  getControl(index: number, controlName: string): string {
    return this.items.at(index).get(controlName)?.value ?? '';
  }


  clearDate(index: number): void {
    this.items.at(index).get('visitedDate')?.setValue('');



  }


  maxOneMonthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const selected = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const maxDate = new Date();
      maxDate.setMonth(today.getMonth() + 1);
      maxDate.setHours(0, 0, 0, 0);

      if (selected > today) {
        return { futureDate: true };
      }

      if (selected < new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())) {
        return { maxOneMonth: true };
      }

      return null;
    };
  }


  // ✅ Form reset
  resetForm(): void {
    this.items.reset();
    this.items.clear();
    this.items.push(this.createItem());
    this.itemSignal.set(this.items.value);
    this.isHoliday.set(false);
    this.isEditMode.set(false);
    this.editingBill.set(null);
  }





}

