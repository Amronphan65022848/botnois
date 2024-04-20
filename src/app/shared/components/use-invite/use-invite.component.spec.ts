import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseInviteComponent } from './use-invite.component';

describe('UseInviteComponent', () => {
  let component: UseInviteComponent;
  let fixture: ComponentFixture<UseInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseInviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
