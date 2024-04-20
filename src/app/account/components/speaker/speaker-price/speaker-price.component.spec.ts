import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerPriceComponent } from './speaker-price.component';

describe('SpeakerPriceComponent', () => {
  let component: SpeakerPriceComponent;
  let fixture: ComponentFixture<SpeakerPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeakerPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
