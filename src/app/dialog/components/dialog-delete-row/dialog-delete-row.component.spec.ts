import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteRowComponent } from './dialog-delete-row.component';

describe('DialogDeleteRowComponent', () => {
  let component: DialogDeleteRowComponent;
  let fixture: ComponentFixture<DialogDeleteRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDeleteRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
