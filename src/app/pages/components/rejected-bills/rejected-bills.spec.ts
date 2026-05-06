import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedBills } from './rejected-bills';

describe('RejectedBills', () => {
  let component: RejectedBills;
  let fixture: ComponentFixture<RejectedBills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedBills],
    }).compileComponents();

    fixture = TestBed.createComponent(RejectedBills);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
