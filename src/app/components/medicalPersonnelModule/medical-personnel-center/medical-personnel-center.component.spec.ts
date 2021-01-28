import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPersonnelCenterComponent } from './medical-personnel-center.component';

describe('MedicalPersonnelCenterComponent', () => {
  let component: MedicalPersonnelCenterComponent;
  let fixture: ComponentFixture<MedicalPersonnelCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalPersonnelCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalPersonnelCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
