import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserChatComponent } from './add-user-chat.component';

describe('AddUserChatComponent', () => {
  let component: AddUserChatComponent;
  let fixture: ComponentFixture<AddUserChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserChatComponent]
    });
    fixture = TestBed.createComponent(AddUserChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
