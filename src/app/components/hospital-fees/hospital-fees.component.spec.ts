import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalFeesComponent } from './hospital-fees.component';

describe('HospitalFeesComponent', () => {
  let component: HospitalFeesComponent;
  let fixture: ComponentFixture<HospitalFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
