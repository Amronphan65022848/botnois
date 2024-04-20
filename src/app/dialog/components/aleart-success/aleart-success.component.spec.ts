import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AleartSuccessComponent } from './aleart-success.component';

describe('AleartSuccessComponent', () => {
  let component: AleartSuccessComponent;
  let fixture: ComponentFixture<AleartSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AleartSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AleartSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
