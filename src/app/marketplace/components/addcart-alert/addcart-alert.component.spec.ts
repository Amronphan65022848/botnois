import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcartAlertComponent } from './addcart-alert.component';

describe('AddcartAlertComponent', () => {
  let component: AddcartAlertComponent;
  let fixture: ComponentFixture<AddcartAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcartAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcartAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
