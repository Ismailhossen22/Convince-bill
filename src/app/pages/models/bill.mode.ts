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

  totalAmount: number;
  subtotal?: number
  items: IConvenceBill[];
  comments?: string;
  rejectionReason?: string;
}

export interface IConvenceBill {
  id: string
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




export enum BillStatus {
  Rejected = 1,
  SentBackToUser = 2,
  Draft = 3,
  SentToSupervisor = 4,
  SentToAdminExecutive = 5,
  SentToTeamHead = 6,
  SentToAdminHead = 7,
  SentToAccountsExecutive = 8,
  SentToAccountsHead = 9,
  SentToPayment = 10
}