import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalpersonnelVerifyAccountComponent } from './medicalpersonnel-verify-account.component';

describe('MedicalpersonnelVerifyAccountComponent', () => {
  let component: MedicalpersonnelVerifyAccountComponent;
  let fixture: ComponentFixture<MedicalpersonnelVerifyAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalpersonnelVerifyAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalpersonnelVerifyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
