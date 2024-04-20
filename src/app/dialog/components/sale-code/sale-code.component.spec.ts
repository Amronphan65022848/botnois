import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleCodeComponent } from './sale-code.component';

describe('SaleCodeComponent', () => {
  let component: SaleCodeComponent;
  let fixture: ComponentFixture<SaleCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaleCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
