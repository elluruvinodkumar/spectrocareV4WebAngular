import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppointmentDetailsComponent } from './view-appointment-details.component';

describe('ViewAppointmentDetailsComponent', () => {
  let component: ViewAppointmentDetailsComponent;
  let fixture: ComponentFixture<ViewAppointmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAppointmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAppointmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
