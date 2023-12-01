import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserBoardComponent } from './add-user-board.component';

describe('AddUserBoardComponent', () => {
  let component: AddUserBoardComponent;
  let fixture: ComponentFixture<AddUserBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserBoardComponent]
    });
    fixture = TestBed.createComponent(AddUserBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
