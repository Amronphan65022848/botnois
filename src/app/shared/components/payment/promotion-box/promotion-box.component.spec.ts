import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionBoxComponent } from './promotion-box.component';

describe('PromotionBoxComponent', () => {
  let component: PromotionBoxComponent;
  let fixture: ComponentFixture<PromotionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromotionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
