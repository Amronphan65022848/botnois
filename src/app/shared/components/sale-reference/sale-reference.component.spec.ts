import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReferenceComponent } from './sale-reference.component';

describe('SaleReferenceComponent', () => {
  let component: SaleReferenceComponent;
  let fixture: ComponentFixture<SaleReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
