import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoPlatformComponent } from './logo-platform.component';

describe('LogoPlatformComponent', () => {
  let component: LogoPlatformComponent;
  let fixture: ComponentFixture<LogoPlatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoPlatformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogoPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
