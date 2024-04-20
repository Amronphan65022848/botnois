import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioRemoveSelectComponent } from './audio-remove-select.component';

describe('AudioRemoveSelectComponent', () => {
  let component: AudioRemoveSelectComponent;
  let fixture: ComponentFixture<AudioRemoveSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioRemoveSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioRemoveSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
