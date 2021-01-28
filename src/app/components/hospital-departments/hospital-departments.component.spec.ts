import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalDepartmentsComponent } from './hospital-departments.component';

describe('HospitalDepartmentsComponent', () => {
  let component: HospitalDepartmentsComponent;
  let fixture: ComponentFixture<HospitalDepartmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalDepartmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
