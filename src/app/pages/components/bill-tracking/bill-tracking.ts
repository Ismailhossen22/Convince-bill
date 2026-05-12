import { Component, inject } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bill-tracking',
  imports: [DatePipe],
  templateUrl: './bill-tracking.html',
  styleUrl: './bill-tracking.css',
})
export class BillTracking {

 public billServece = inject(BillService)
 public billdata=this.billServece.billSignal;


  
}
