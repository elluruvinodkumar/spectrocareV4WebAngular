import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPersonnelDashboardComponent } from './medical-personnel-dashboard.component';

describe('MedicalPersonnelDashboardComponent', () => {
  let component: MedicalPersonnelDashboardComponent;
  let fixture: ComponentFixture<MedicalPersonnelDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalPersonnelDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalPersonnelDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
