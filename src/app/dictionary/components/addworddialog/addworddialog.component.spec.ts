import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddworddialogComponent } from './addworddialog.component';

describe('AddworddialogComponent', () => {
  let component: AddworddialogComponent;
  let fixture: ComponentFixture<AddworddialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddworddialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddworddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
