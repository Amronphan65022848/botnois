import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerInviteComponent } from './speaker-invite.component';

describe('SpeakerInviteComponent', () => {
  let component: SpeakerInviteComponent;
  let fixture: ComponentFixture<SpeakerInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeakerInviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
