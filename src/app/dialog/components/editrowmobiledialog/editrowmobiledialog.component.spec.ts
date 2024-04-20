import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditrowmobiledialogComponent } from './editrowmobiledialog.component';

describe('EditrowmobiledialogComponent', () => {
  let component: EditrowmobiledialogComponent;
  let fixture: ComponentFixture<EditrowmobiledialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditrowmobiledialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditrowmobiledialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
