import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicapersonnelResetPasswordComponent } from './medicapersonnel-reset-password.component';

describe('MedicapersonnelResetPasswordComponent', () => {
  let component: MedicapersonnelResetPasswordComponent;
  let fixture: ComponentFixture<MedicapersonnelResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicapersonnelResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicapersonnelResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
