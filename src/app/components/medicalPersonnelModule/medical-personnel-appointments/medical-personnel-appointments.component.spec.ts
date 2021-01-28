import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPersonnelAppointmentsComponent } from './medical-personnel-appointments.component';

describe('MedicalPersonnelAppointmentsComponent', () => {
  let component: MedicalPersonnelAppointmentsComponent;
  let fixture: ComponentFixture<MedicalPersonnelAppointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalPersonnelAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalPersonnelAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
