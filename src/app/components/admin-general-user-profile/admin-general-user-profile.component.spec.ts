import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGeneralUserProfileComponent } from './admin-general-user-profile.component';

describe('AdminGeneralUserProfileComponent', () => {
  let component: AdminGeneralUserProfileComponent;
  let fixture: ComponentFixture<AdminGeneralUserProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGeneralUserProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGeneralUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
