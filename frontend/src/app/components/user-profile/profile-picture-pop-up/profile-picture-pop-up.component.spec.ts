import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePicturePopUpComponent } from './profile-picture-pop-up.component';

describe('ProfilePicturePopUpComponent', () => {
  let component: ProfilePicturePopUpComponent;
  let fixture: ComponentFixture<ProfilePicturePopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilePicturePopUpComponent]
    });
    fixture = TestBed.createComponent(ProfilePicturePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
