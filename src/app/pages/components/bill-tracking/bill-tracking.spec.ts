import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillTracking } from './bill-tracking';

describe('BillTracking', () => {
  let component: BillTracking;
  let fixture: ComponentFixture<BillTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillTracking],
    }).compileComponents();

    fixture = TestBed.createComponent(BillTracking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
