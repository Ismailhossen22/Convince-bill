import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTest } from './shared-test';

describe('SharedTest', () => {
  let component: SharedTest;
  let fixture: ComponentFixture<SharedTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTest],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
