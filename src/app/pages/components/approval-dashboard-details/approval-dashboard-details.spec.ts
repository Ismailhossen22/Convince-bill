import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalDashboardDetails } from './approval-dashboard-details';

describe('ApprovalDashboardDetails', () => {
  let component: ApprovalDashboardDetails;
  let fixture: ComponentFixture<ApprovalDashboardDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalDashboardDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalDashboardDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
