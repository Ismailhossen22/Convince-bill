
export interface UserInfo {
  userId?: number;
  password?: string;
  name?: string;
  contacNo?: string;
  designation?: string;
  submitDate?: string;
  department?:string;
  group?:string

}

export interface Bill {

  totalAmount?: number;
  subtotal?: number;
  items: IConvenceBill[];
  comments?: string;
  rejectReason?: string;
}

export interface IConvenceBill {
  visitedDate?: string;
  toLocation?: string;
  fromLocation?: string;
  purpose?: string;
  transportMode?: string;
  companyName?: string;
  userId?: number;
  amount?: number;
  status?: number;
  convID: number;
  userRole?: string | null;
  currentStatus?: number;
  ctid:number;
  cP_ID:number;
  submittedDate:string;
  
}

export interface IApprovalDetail {
  approvalDate: string | null;
  convID: number;
  convOwnerUID: number;
  personId: number;
  personName: string;
  submissionDate: string;
  totalAmount: number;
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