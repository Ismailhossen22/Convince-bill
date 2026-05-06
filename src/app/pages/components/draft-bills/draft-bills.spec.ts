import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftBills } from './draft-bills';

describe('DraftBills', () => {
  let component: DraftBills;
  let fixture: ComponentFixture<DraftBills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftBills],
    }).compileComponents();

    fixture = TestBed.createComponent(DraftBills);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
