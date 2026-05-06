// models/bill.model.ts
export interface BillItem {
  sl: number;
  visitedDate: string;
  toLocation: string;
  fromLocation: string;
  purpose: string;
  transportMode: string;
  companyName: string;
  userId: string;
  amount: number;
  status: number;
  convID: string;
  userRole: string | null;


}

export interface UserData {
  userId: string;
  name: string;
  contacNo: string;
  designation: string;
  submitDate?: string;

}
export interface Bill {
  id?: string;
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' |
  'rejected' | 'in_review';
  items: BillItem[];
  comments?: string;
  rejectionReason?: string;
}

export interface IConvenceBill {
  visitedDate: string;
  toLocation: string;
  fromLocation: string;
  purpose: string;
  transportMode: string;
  companyName: string;
  userId: string;
  amount: string;
  status: number;
  convID: string;
  userRole: string | null;
}