import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityNewsComponent } from './activity-news.component';

describe('ActivityNewsComponent', () => {
  let component: ActivityNewsComponent;
  let fixture: ComponentFixture<ActivityNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityNewsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
