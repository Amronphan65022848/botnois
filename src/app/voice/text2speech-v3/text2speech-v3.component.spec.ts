import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Text2speechV3Component } from './text2speech-v3.component';

describe('Text2speechV3Component', () => {
  let component: Text2speechV3Component;
  let fixture: ComponentFixture<Text2speechV3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Text2speechV3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Text2speechV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
