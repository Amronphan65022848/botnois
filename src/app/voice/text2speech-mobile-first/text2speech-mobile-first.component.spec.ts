import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Text2speechMobileFirstComponent } from './text2speech-mobile-first.component';

describe('Text2speechMobileFirstComponent', () => {
  let component: Text2speechMobileFirstComponent;
  let fixture: ComponentFixture<Text2speechMobileFirstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Text2speechMobileFirstComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Text2speechMobileFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
