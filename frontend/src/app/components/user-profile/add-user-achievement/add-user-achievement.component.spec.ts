import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserAchievementComponent } from './add-user-achievement.component';

describe('AddUserAchievementComponent', () => {
  let component: AddUserAchievementComponent;
  let fixture: ComponentFixture<AddUserAchievementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserAchievementComponent]
    });
    fixture = TestBed.createComponent(AddUserAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
