import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointBoxComponent } from './point-box.component';

describe('PointBoxComponent', () => {
  let component: PointBoxComponent;
  let fixture: ComponentFixture<PointBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
