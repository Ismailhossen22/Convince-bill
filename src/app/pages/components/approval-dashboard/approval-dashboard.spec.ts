import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalDashboard } from './approval-dashboard';

describe('ApprovalDashboard', () => {
  let component: ApprovalDashboard;
  let fixture: ComponentFixture<ApprovalDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
