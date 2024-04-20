import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningBottomComponent } from './warning-bottom.component';

describe('WarningBottomComponent', () => {
  let component: WarningBottomComponent;
  let fixture: ComponentFixture<WarningBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarningBottomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
