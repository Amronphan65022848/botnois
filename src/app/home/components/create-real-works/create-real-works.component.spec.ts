import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRealWorksComponent } from './create-real-works.component';

describe('CreateRealWorksComponent', () => {
  let component: CreateRealWorksComponent;
  let fixture: ComponentFixture<CreateRealWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRealWorksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRealWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
