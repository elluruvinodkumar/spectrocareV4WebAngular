import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMedicalRecordComponent } from './all-medical-record.component';

describe('AllMedicalRecordComponent', () => {
  let component: AllMedicalRecordComponent;
  let fixture: ComponentFixture<AllMedicalRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllMedicalRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
