import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllThreadsComponent } from './all-threads.component';

describe('AllThreadsComponent', () => {
  let component: AllThreadsComponent;
  let fixture: ComponentFixture<AllThreadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllThreadsComponent]
    });
    fixture = TestBed.createComponent(AllThreadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
