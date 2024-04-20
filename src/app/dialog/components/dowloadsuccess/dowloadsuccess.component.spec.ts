import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowloadsuccessComponent } from './dowloadsuccess.component';

describe('DowloadsuccessComponent', () => {
  let component: DowloadsuccessComponent;
  let fixture: ComponentFixture<DowloadsuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DowloadsuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DowloadsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
