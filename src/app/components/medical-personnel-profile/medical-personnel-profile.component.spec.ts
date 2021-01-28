import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPersonnelProfileComponent } from './medical-personnel-profile.component';

describe('MedicalPersonnelProfileComponent', () => {
  let component: MedicalPersonnelProfileComponent;
  let fixture: ComponentFixture<MedicalPersonnelProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalPersonnelProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalPersonnelProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
