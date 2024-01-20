import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGameComponent } from './user-game.component';

describe('UserGameComponent', () => {
  let component: UserGameComponent;
  let fixture: ComponentFixture<UserGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserGameComponent]
    });
    fixture = TestBed.createComponent(UserGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
