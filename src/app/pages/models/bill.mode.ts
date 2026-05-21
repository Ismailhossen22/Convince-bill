


export interface Bill {

  totalAmount?: number;
  subtotal?: number;
  items: IConvenceBill[];
  comments?: string;
  rejectReason?: string;
}

export interface IConvenceBill {
  visitedDate: string;
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
  ctid: number;
  cP_ID: number;
  submittedDate: string;
  name?: string;
  sentBackFromStage: string | null;
  comments:string

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


export enum BillStatusName {
  Rejected = 1,
  Returned = 2,
  Draft = 3,
  PendingSupervisor = 4,
  PendingAdminExec = 5,
  PendingTeamHead = 6,
  PendingAdminHead = 7,
  PendingAccountsExec = 8,
  PendingAccountsHead = 9,
  InPaymentProcess = 10
}

