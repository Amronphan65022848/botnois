import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioDownloadSelectComponent } from './audio-download-select.component';

describe('AudioDownloadSelectComponent', () => {
  let component: AudioDownloadSelectComponent;
  let fixture: ComponentFixture<AudioDownloadSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioDownloadSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioDownloadSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
