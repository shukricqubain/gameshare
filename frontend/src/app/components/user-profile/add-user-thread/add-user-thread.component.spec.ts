import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserThreadComponent } from './add-user-thread.component';

describe('AddUserThreadComponent', () => {
  let component: AddUserThreadComponent;
  let fixture: ComponentFixture<AddUserThreadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserThreadComponent]
    });
    fixture = TestBed.createComponent(AddUserThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
