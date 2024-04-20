import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioDownloadDialogComponent } from './audio-download-dialog.component';

describe('AudioDownloadDialogComponent', () => {
  let component: AudioDownloadDialogComponent;
  let fixture: ComponentFixture<AudioDownloadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioDownloadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioDownloadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
