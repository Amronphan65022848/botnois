import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceAlertComponent } from './marketplace-alert.component';

describe('MarketplaceAlertComponent', () => {
  let component: MarketplaceAlertComponent;
  let fixture: ComponentFixture<MarketplaceAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketplaceAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
