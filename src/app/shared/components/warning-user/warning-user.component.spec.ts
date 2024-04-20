import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningUserComponent } from './warning-user.component';

describe('WarningUserComponent', () => {
  let component: WarningUserComponent;
  let fixture: ComponentFixture<WarningUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarningUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
