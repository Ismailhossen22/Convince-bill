// models/bill.model.ts
// export interface BillItem {
//   visitedDate: string;
//   toLocation: string;
//   fromLocation: string;
//   purpose: string;
//   transportMode: string;
//   companyName: string;
//   userId: string;
//   amount: number;
//   status: number;
//   convID: string;
//   userRole: string | null;


// }

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
  status: BillStatus;
  items: IConvenceBill[];
  comments?: string;
  rejectionReason?: string;
}

export interface IConvenceBill {
  id:string;
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


export enum BillStatus {
  DRAFT = 1,
  PENDING = 2,
  APPROVED = 3,
  REJECTED = 4,
  IN_REVIEW = 5
}
