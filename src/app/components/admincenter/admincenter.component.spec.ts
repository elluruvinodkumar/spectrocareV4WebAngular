import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincenterComponent } from './admincenter.component';

describe('AdmincenterComponent', () => {
  let component: AdmincenterComponent;
  let fixture: ComponentFixture<AdmincenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmincenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmincenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
