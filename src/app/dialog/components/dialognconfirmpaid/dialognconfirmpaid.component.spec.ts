import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialognconfirmpaidComponent } from './dialognconfirmpaid.component';

describe('DialognconfirmpaidComponent', () => {
  let component: DialognconfirmpaidComponent;
  let fixture: ComponentFixture<DialognconfirmpaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialognconfirmpaidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialognconfirmpaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
