import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalRolesComponent } from './hospital-roles.component';

describe('HospitalRolesComponent', () => {
  let component: HospitalRolesComponent;
  let fixture: ComponentFixture<HospitalRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
