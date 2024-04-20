import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptStudioComponent } from './prompt-studio.component';

describe('PromptStudioComponent', () => {
  let component: PromptStudioComponent;
  let fixture: ComponentFixture<PromptStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptStudioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromptStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
