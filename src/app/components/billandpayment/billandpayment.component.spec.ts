import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillandpaymentComponent } from './billandpayment.component';

describe('BillandpaymentComponent', () => {
  let component: BillandpaymentComponent;
  let fixture: ComponentFixture<BillandpaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillandpaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillandpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
