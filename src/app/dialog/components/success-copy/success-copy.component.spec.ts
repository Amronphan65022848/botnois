import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessCopyComponent } from './success-copy.component';

describe('SuccessCopyComponent', () => {
  let component: SuccessCopyComponent;
  let fixture: ComponentFixture<SuccessCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessCopyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
