import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAchievementComponent } from './user-achievement.component';

describe('UserAchievementComponent', () => {
  let component: UserAchievementComponent;
  let fixture: ComponentFixture<UserAchievementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserAchievementComponent]
    });
    fixture = TestBed.createComponent(UserAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
