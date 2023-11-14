import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThreadItemComponent } from './add-thread-item.component';

describe('AddThreadItemComponent', () => {
  let component: AddThreadItemComponent;
  let fixture: ComponentFixture<AddThreadItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddThreadItemComponent]
    });
    fixture = TestBed.createComponent(AddThreadItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
