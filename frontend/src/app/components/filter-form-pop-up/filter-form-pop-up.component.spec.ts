import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterFormPopUpComponent } from './filter-form-pop-up.component';

describe('FilterFormPopUpComponent', () => {
  let component: FilterFormPopUpComponent;
  let fixture: ComponentFixture<FilterFormPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterFormPopUpComponent]
    });
    fixture = TestBed.createComponent(FilterFormPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
