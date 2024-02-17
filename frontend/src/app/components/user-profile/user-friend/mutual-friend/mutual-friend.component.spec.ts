import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualFriendComponent } from './mutual-friend.component';

describe('MutualFriendComponent', () => {
  let component: MutualFriendComponent;
  let fixture: ComponentFixture<MutualFriendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MutualFriendComponent]
    });
    fixture = TestBed.createComponent(MutualFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
