import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxListsComponent } from './box-lists.component';

describe('BoxListsComponent', () => {
  let component: BoxListsComponent;
  let fixture: ComponentFixture<BoxListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxListsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoxListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
