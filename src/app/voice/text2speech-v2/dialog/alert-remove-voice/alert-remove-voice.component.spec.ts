import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertRemoveVoiceComponent } from './alert-remove-voice.component';

describe('AlertRemoveVoiceComponent', () => {
  let component: AlertRemoveVoiceComponent;
  let fixture: ComponentFixture<AlertRemoveVoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertRemoveVoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertRemoveVoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
