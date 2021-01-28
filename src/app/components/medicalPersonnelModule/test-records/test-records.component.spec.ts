import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRecordsComponent } from './test-records.component';

describe('TestRecordsComponent', () => {
  let component: TestRecordsComponent;
  let fixture: ComponentFixture<TestRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestRecordsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
