import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIHTBComponent } from './dialog-ihtb.component';

describe('DialogIHTBComponent', () => {
  let component: DialogIHTBComponent;
  let fixture: ComponentFixture<DialogIHTBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogIHTBComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIHTBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
