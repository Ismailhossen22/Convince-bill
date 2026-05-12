import { BillStatus, IConvenceBill, UserInfo } from './../../models/bill.mode';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BillService } from '../../services/bill.service';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ShortDatePipe } from '../../pipes/short-data.pipe';
import { debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../../features/services/AuthService';



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
  AuthService = inject(AuthService)
  private readonly router = inject(Router);
  isLoading = signal<boolean>(false);
  userInfo = signal<UserInfo | null>(null);
  usrform!: FormGroup;
  isHoliday = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  editingBill = signal<IConvenceBill | null>(null);
  isSubmitting = signal<boolean>(false);


  itemSignal = signal<any[]>([]);
  totalAmount = computed(() =>
    this.itemSignal().reduce(
      (sum, item) => sum + (+item.amount || 0), 0
    )
  );

  transportModes = ['CNG', 'Uber', 'Bus', 'Own Vehicle'];
  purposes = ['Client Meeting', 'Office Work', 'Field Visit'];

  private receivedData: IConvenceBill | null = null;
  currentUser = this.AuthService.currentUser;

  constructor() {
    const navigation = this.router.currentNavigation();
    this.receivedData = navigation?.extras.state?.['billData'] as IConvenceBill;
  }

  ngOnInit(): void {

    this.setupCompanyNameListener(0);

    if (this.receivedData) {
      this.isEditMode.set(true);
      // this.editingBill.set(this.bill);
      this.patchSingleRow(this.receivedData);

    }

    this.itemSignal.set(this.items.value);
    this.items.valueChanges.subscribe(val => {
      this.itemSignal.set(val);
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
      amount: [0, Validators.required],
      convID:[]

    });
  }



  addRow(): void {
    this.items.push(this.createItem());

    const newIndex = this.items.length - 1;
    this.setupCompanyNameListener(newIndex);

  }

  removeRow(i: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(i);

    }
  }

  //  Holiday check — signal দিয়ে
  checkHoliday(event: Event): void {
    const date = (event.target as HTMLInputElement).value;
    const day = new Date(date).getDay();
    this.isHoliday.set(day === 5 || day === 6);
  }
  // private loadBillData(bill: Bill): void {
  //   this.items.clear();
  //   bill.items?.forEach(item => {
  //     this.items.push(this.fb.group(item));
  //   });
  //   this.itemSignal.set(this.items.value);
  // }

  patchSingleRow(data: IConvenceBill) {
    if (this.items.length > 0) {
      this.items.at(0).patchValue(data);
    }
  }

  //  Build bill object — DRY
  private buildBillPayload(status: BillStatus, index: number = 0): IConvenceBill {
    const items = this.items.at(index).value;
    // const convid = this.editingBill()?.convID || this.generateCustomId(5);
    return {
      ...items,
      userId: this.currentUser()?.userId,
      status: status,
      userRole: this.currentUser()?.designation,

    };
  }

  generateCustomId(length: number = 5): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  //  Save Draft
  saveDraft(): void {
    if (this.bilform.invalid) {
      this.bilform.markAllAsTouched();
      return;
    }
   debugger;

    this.items.controls.forEach((_, i) => {
      const payload = this.buildBillPayload(BillStatus.Draft, i);
      debugger;
      this.billService.AddBillApi(payload).subscribe({
        next: (res) => {
          debugger;
          console.log(`Item ${i + 1} saved:`, res);

          if (i === this.items.length - 1) {
            this.router.navigate(['/draft-bills']);
          }
        },
        error: (err) => console.error(`Error saving item ${i}:`, err)
      });
    });
  }

  editBill() {
     debugger;
    if (this.bilform.invalid) {
      this.bilform.markAllAsTouched();
      return;
    }
    const formData = this.items.value;
    const user = this.AuthService.currentUser();
    formData.forEach((item: IConvenceBill) => {
      const payload = {
        convID: item.convID,
        fromLocation: item.fromLocation,
        toLocation: item.toLocation,
        totalAmount: item.amount?.toString(),
        updatedByUID: user?.userId,
        ctid:this.receivedData?.ctid ,
        cP_ID: "",
        companyName: item.companyName,
        transportDate: item.visitedDate,
        transportPurpose: item.purpose,
        transportMode: item.transportMode,
       
      };
     

      this.billService.editBillApi(payload).subscribe({
        next: (item) => {
        console.log('Update Success for:', item.convID);
          this.router.navigate(['/draft-bills']);
        }, error: (err) => console.error('Update failed:', err)
      })


    });

  }

  suggestions: any[] = [];
  activeDropdownIndex: number | null = null;

  setupCompanyNameListener(index: number) {
    const itemFormGroup = this.items.at(index) as FormGroup;
    const companyControl = itemFormGroup.get('companyName');

    if (!companyControl) return;

    companyControl.valueChanges.pipe(
      debounceTime(200),
      map(value => typeof value === 'string' ? value.trim() : ''),
      distinctUntilChanged(),

      switchMap(query => {
        debugger;
        if (query.length > 1) {
          return this.billService.getCompanySuggestions(query);
        }
        return of([]);
      })
    ).subscribe({
      next: (data) => {
        this.suggestions = data;
        this.activeDropdownIndex = index;
      },
      error: (err) => {
        console.error(err);
        this.suggestions = [];
      }
    });
  }


  selectCompany(name: string, index: number) {
    const itemFormGroup = this.items.at(index) as FormGroup;
    itemFormGroup.patchValue({ companyName: name }, { emitEvent: false });

    this.suggestions = [];
    this.activeDropdownIndex = null;
  }

  closeDropdown() {

    setTimeout(() => {
      this.activeDropdownIndex = null;
      this.suggestions = [];
    }, 200);
  }


  // ✅ Submit to Supervisor
  submitToSupervisor(): void {
    if (this.items.invalid) {
      this.items.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const payload = this.buildBillPayload(BillStatus.SentToAccountsExecutive);

    // if (this.isEditMode() && this.editingBill()) {
    //   this.billService.updateBill({
    //     ...payload,
    //     id: this.editingBill()!.id
    //   });
    // } else {
    //   this.billService.submitBill(payload);
    // }

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

  hasError(index: number, controlName: string, errorName: string) {
    const group = this.items.at(index) as FormGroup;
    const control = group?.get(controlName);
    return control?.hasError(errorName) && (control?.dirty || control?.touched);
  }
  getControl(index: number, controlName: string) {
    const group = this.items.at(index) as FormGroup;
    return group?.get(controlName)?.value;
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




