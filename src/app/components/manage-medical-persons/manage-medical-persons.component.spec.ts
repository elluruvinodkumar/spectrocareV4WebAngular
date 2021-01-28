import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMedicalPersonsComponent } from './manage-medical-persons.component';

describe('ManageMedicalPersonsComponent', () => {
  let component: ManageMedicalPersonsComponent;
  let fixture: ComponentFixture<ManageMedicalPersonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMedicalPersonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMedicalPersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
