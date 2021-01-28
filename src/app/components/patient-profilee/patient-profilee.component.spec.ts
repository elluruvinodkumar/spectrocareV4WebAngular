import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientProfileeComponent } from './patient-profilee.component';

describe('PatientProfileeComponent', () => {
  let component: PatientProfileeComponent;
  let fixture: ComponentFixture<PatientProfileeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientProfileeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientProfileeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
