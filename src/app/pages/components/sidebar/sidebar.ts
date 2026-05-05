import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {


  menuItems = [
    {
      icon: '➕', label: 'Create Bill',
      route: '/create-bill'
    },
    {
      icon: '📋', label: 'Draft Bills',
      route: '/draft-bills'
    },
    {
      icon: '❌', label: 'Rejected Bills',
      route: '/rejected-bills'
    },
    {
      icon: '📊', label: 'Bill Tracking /Summary',
      route: '/bill-tracking'
    },
    {
      icon: '✅', label: 'Approval Dashboard',
      route: '/approval-dashboard'
    },
    {
      icon: '🕐', label: 'Approval History',
      route: '/approval-history'
    },
    {
      icon: '📅', label: 'Monthly Report',
      route: '/monthly-report'
    },
  ];


}
