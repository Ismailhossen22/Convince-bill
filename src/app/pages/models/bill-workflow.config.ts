import { BillStatusName } from "./bill.mode";

export const WORKFLOW_RULES: Record<string, { currentStatus: BillStatusName; nextStatus: BillStatusName }> = {
    'Supervisor': { currentStatus: BillStatusName.PendingSupervisor, nextStatus: BillStatusName.PendingAdminExec },    // 4 -> 5
    'AdminExec': { currentStatus: BillStatusName.PendingAdminExec, nextStatus: BillStatusName.PendingTeamHead },     // 5 -> 6
    'TeamHead': { currentStatus: BillStatusName.PendingTeamHead, nextStatus: BillStatusName.PendingAdminHead },    // 6 -> 7
    'AdminHead': { currentStatus: BillStatusName.PendingAdminHead, nextStatus: BillStatusName.PendingAccountsExec }, // 7 -> 8
    'AccountsExec': { currentStatus: BillStatusName.PendingAccountsExec, nextStatus: BillStatusName.PendingAccountsHead }, // 8 -> 9
    'AccountsHead': { currentStatus: BillStatusName.PendingAccountsHead, nextStatus: BillStatusName.InPaymentProcess },    // 9 -> 10
};


export const ROLE_STATUS_MAP: Record<string, BillStatusName> = {
  'Supervisor':   BillStatusName.PendingSupervisor,   // ৪
  'AdminExec':    BillStatusName.PendingAdminExec,    // ৫
  'TeamHead':     BillStatusName.PendingTeamHead,     // ৬
  'AdminHead':    BillStatusName.PendingAdminHead,    // ৭
  'AccountsExec': BillStatusName.PendingAccountsExec, // ৮
  'AccountsHead': BillStatusName.PendingAccountsHead, // ৯
};