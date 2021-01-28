import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAppointmentRecordComponent } from './patient-appointment-record.component';

describe('PatientAppointmentRecordComponent', () => {
  let component: PatientAppointmentRecordComponent;
  let fixture: ComponentFixture<PatientAppointmentRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientAppointmentRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAppointmentRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
