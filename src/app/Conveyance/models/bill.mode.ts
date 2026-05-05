// models/bill.model.ts
export interface BillItem {
  sl: number;
  visitedDate: string;
  from: string;
  to: string;
  distance: number;
  globalCompany: string;
  purpose: string;
  modeOfTransport: string;
  amount: number;
}

export interface Bill {
  id?: string;
  billNo?: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  submissionDate: string;
  travelDays: number;
  dateRange: string;
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' |
          'rejected' | 'in_review';
  items: BillItem[];
  comments?: string;
  rejectionReason?: string;
}