import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFullUsersComponent } from './dialog-full-users.component';

describe('DialogFullUsersComponent', () => {
  let component: DialogFullUsersComponent;
  let fixture: ComponentFixture<DialogFullUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFullUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFullUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
