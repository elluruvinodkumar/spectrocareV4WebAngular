import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewTestComponent } from './create-new-test.component';

describe('CreateNewTestComponent', () => {
  let component: CreateNewTestComponent;
  let fixture: ComponentFixture<CreateNewTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
