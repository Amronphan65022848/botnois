import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongwordComponent } from './longword.component';

describe('LongwordComponent', () => {
  let component: LongwordComponent;
  let fixture: ComponentFixture<LongwordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongwordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongwordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
