import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalpersonnelsignupComponent } from './medicalpersonnelsignup.component';

describe('MedicalpersonnelsignupComponent', () => {
  let component: MedicalpersonnelsignupComponent;
  let fixture: ComponentFixture<MedicalpersonnelsignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalpersonnelsignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalpersonnelsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
