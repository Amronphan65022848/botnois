import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceCoProjectComponent } from './advice-co-project.component';

describe('AdviceCoProjectComponent', () => {
  let component: AdviceCoProjectComponent;
  let fixture: ComponentFixture<AdviceCoProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdviceCoProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdviceCoProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
