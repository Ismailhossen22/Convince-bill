import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Bill, BillStatus, IConvenceBill } from '../models/bill.mode';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../../features/services/AuthService';

@Injectable({ providedIn: 'root' })
export class BillService {
  private readonly http = inject(HttpClient);
  private readonly AuthService = inject(AuthService);
  // private apiUrl = 'json/convence-bill.json';

  private apiUrl = 'http://localhost:3000/bills';
  private getApprovalUrl = 'https://localhost:7226/Conveyance/GetApproval';
  private getApprovalDetailsUrl = 'https://localhost:7226/Conveyance/GetApprovalDetails';
  private getBillTrackingUrl = 'https://localhost:7226/Conveyance/GetBillTracking';
  private getVisitsUrl = 'https://localhost:7226/Conveyance/GetVisits';
  private UpdateStatusUrl = 'https://localhost:7226/Conveyance/UpdateStatus';
  private editBillUrl = 'https://localhost:7226/Conveyance/EditBill';
  private deleteBillingUrl = 'https://localhost:7226/Conveyance/DeleteBilling';
  private createbillUrl = 'https://localhost:7174/Conveyance/CreateBilling';

  private billinfo = signal<IConvenceBill[]>([]);

  billSignal = signal<Bill[]>([]);
  selectedDate = signal<string>('');

  constructor() {
    this.loadBills();
  }


  loadBills() {
    const user = this.AuthService.currentUser;
    const userId = user()?.userId;
    if (!userId) return;

    const url = `${this.getBillTrackingUrl}?ConvOwnerUID=${userId}`;
    //console.log('Final URL:', url);

    this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log(res)
        const rawData = res?.event?.eventData?.[0]?.value || [];

        if (rawData.length === 0) {
          this.billSignal.set([]);
          this.billinfo.set([]);
          return;
        }

        const formattedData: IConvenceBill[] = rawData.map((item: any) => ({
          visitedDate: item.transportDate,
          submittedDate: item.submittedDate,
          toLocation: item.toLocation,
          fromLocation: item.fromLocation,
          purpose: item.purpose,
          transportMode: item.modeOfTransport,
          companyName: item.visitedCompany,
          amount: item.amount,
          status: item.status,
          currentStatus: item.currentStatus,
          convID: item.convID || '',
          ctid: item.ctid || '',
          cP_ID: item.cP_ID,
          userRole: item.userRole || null,
          sentBackFromStage:item.sentBackFromStage||null,
          comments:item.comments

        }));

        this.billinfo.set(formattedData);

        const groupedByStatus = formattedData.reduce(
          (acc, item) => {
            const statusValue = (item.status ?? 0);
            if (!acc[statusValue]) {
              acc[statusValue] = [];
            }
            acc[statusValue].push(item);
            return acc;
          },
          {} as Record<number, IConvenceBill[]>,
        );

        const transformedBill: Bill[] = Object.keys(groupedByStatus).map((statusKey) => {
          const numericStatus = Number(statusKey);
          const items = groupedByStatus[numericStatus];

          return {
            items: items, // IConvenceBill[]
            totalAmount: items.reduce((sum, item) => sum + (item.amount || 0), 0),
            subtotal: items.reduce((sum, item) => sum + (item.amount || 0), 0),
            comments: '',
            rejectReason: '',
          };
        });

        // console.log('Transformed Data:', transformedBill);

        this.billSignal.set(transformedBill);
      },
      error: (err) => {
        console.error('API থেকে ডাটা লোড করতে সমস্যা হয়েছে:', err);
      },
    });
  }

  AddBillApi(bill: IConvenceBill): Observable<IConvenceBill> {
    return this.http.post<IConvenceBill>(this.createbillUrl, bill).pipe(

    );
  }







  editBillApi(payload: any): Observable<any> {
    return this.http.put<any>(this.editBillUrl, payload);
  }

  getApprovalDetails(
    submissionDate: string,
    filteredUID?: number,
    userRole?: string,
    statusId?: number,
  ): Observable<any> {
    const url = this.getApprovalDetailsUrl;


    let params = new HttpParams().set('SubmissionDate', submissionDate);


    if (filteredUID !== undefined && filteredUID !== null) {
      params = params.set('FilteredUID', filteredUID.toString());
    }

    if (userRole && userRole.trim() !== '') {
      params = params.set('UserRole', userRole);
    }

    if (statusId !== undefined && statusId !== null) {
      params = params.set('StatusId', statusId.toString());
    }

    console.log('Final API URL:', `${url}?${params.toString()}`);

    return this.http.get<any>(url, { params });
  }


  getApproval(
    From: string,
    To: string,
    UserRole?: string,
    StatusId?: number,
    UID?: number,
  ): Observable<any> {
    const url = this.getApprovalUrl;

    let params = new HttpParams().set('From', From).set('To', To);

    if (UID != null) {
      params = params.set('UID', UID.toString());
    }
    if (UserRole != null) {
      params = params.set('UserRole', UserRole);
    }
    if (StatusId != null) {
      params = params.set('StatusId', StatusId.toString());
    }
    // console.log('Final API URL:', `${url}?${params.toString()}`);
    return this.http.get<any>(url, { params });
  }

  getCompanySuggestions(query: string): Observable<any[]> {
    return this.http.get<any[]>(
      `https://contentapi.bdjobs.com/api/Company/suggestions?query=${query}`,
    );
  }

  getBills(): Observable<Bill[]> {
    return this.http.get<IConvenceBill[]>(this.apiUrl).pipe(
      map((data) => {
        if (!data || data.length === 0) return [];

        const grouped = data.reduce((acc: { [key: string]: IConvenceBill[] }, item) => {
          const dateKey = item.visitedDate ?? ''.split('T')[0];
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(item);
          return acc;
        }, {});

        const grandTotal = data.reduce((sum, item) => sum + (item.amount || 0), 0);

        return Object.keys(grouped).map((date) => ({
          items: grouped[date],
          subtotal: grouped[date].reduce((sum, item) => sum + (item.amount || 0), 0),
          totalAmount: grandTotal,
          comments: '',
          rejectionReason: '',
        }));
      }),
    );
  }

  // draftBills = computed(() =>
  //   this.billSignal().filter((b) =>
  //     b.items &&
  //     b.items.length > 0 &&
  //     b.items.some(item => item.status == BillStatus.Draft)
  //   )
  // );

  draftBills = computed(() =>
    this.billSignal().filter((b) =>
      b.items?.length > 0 &&
      b.items.some(item => item.status == BillStatus.Draft) 
    )
  );


  pendingBills = computed(() =>
    this.billSignal().filter(
      (b) => b.items.length > 0 && b.items[0].status === BillStatus.SentToSupervisor,
    ),
  );

  rejectedBills = computed(() =>
    this.billSignal().filter(
      (b) => b.items.length > 0 &&   b.items.some(item => item.status == BillStatus.Rejected) 
    ),
  );

  approvedBills = computed(() =>
    this.billSignal().filter(
      (b) => b.items.length > 0 && b.items[0].status === BillStatus.SentToSupervisor,
    ),
  );

  allBills = computed(() => this.billSignal());

  saveDraft(bill: Bill) {
    this.billSignal.update((bills) => [...bills, bill]);
  }

  submitBill(bill: Bill) {
    this.billSignal.update((bills) => [...bills, bill]);
  }

  updateBill(updatedBill: IConvenceBill) {
    this.billinfo.update((bills) =>
      bills.map((item) => (item.convID === updatedBill.convID ? updatedBill : item)),
    );
  }



  updateBillStatus(convIds: number[],actionByUid:number,  currentStatus: number, requestedStatus: number, comment: string = "" ): Observable<any> {
    const url = this.UpdateStatusUrl;
    const userId = this.AuthService.currentUser()?.userId || "";

    const body = {
      convIDs: convIds,
      currentStatus: currentStatus,
      requestedStatus: requestedStatus,
      comment: comment,
      actionByUid: actionByUid
    };

    return this.http.put(url, body)


  }

  approveBill(convID: number) {
    this.billSignal.update((bills) =>
      bills.map((b) => {
        if (b.items.length > 0 && b.items[0].convID === convID) {
          const updatedItems = b.items.map((item) => ({ ...item, status: 1 }));

          return { ...b, items: updatedItems };
        }
        return b;
      }),
    );
  }

  rejectBill(convID: number, reason: string) {
    this.billSignal.update((bills) =>
      bills.map((b) => {
        if (b.items.length > 0 && b.items[0].convID === convID) {
          const updatedItems = b.items.map((item) => ({ ...item, status: 2 }));

          return {
            ...b,
            items: updatedItems,
            rejectionReason: reason,
          };
        }
        return b;
      }),
    );
  }


  deleteBill(convID: number, ctid: number) {
    const url = this.deleteBillingUrl;
    const body = { ctid, convID };

    return this.http.post(url, body).pipe(
      tap(() => {
        this.billSignal.update((bills) => {
          return bills
            .map((bill) => ({
              ...bill,

              items: bill.items.filter((item: any) => item.convID !== convID)
            }))
            .filter((bill) => bill.items.length > 0);
        });
      })
    );
  }


  getUserData(userId: string) {
    return this.http.get<any>(`https://api.example.com/user/${userId}`);
  }
}
