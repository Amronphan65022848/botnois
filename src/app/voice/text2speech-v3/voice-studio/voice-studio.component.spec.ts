import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceStudioComponent } from './voice-studio.component';

describe('VoiceStudioComponent', () => {
  let component: VoiceStudioComponent;
  let fixture: ComponentFixture<VoiceStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceStudioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
