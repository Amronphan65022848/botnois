import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportexportT2sComponent } from './importexport-t2s.component';

describe('ImportexportT2sComponent', () => {
  let component: ImportexportT2sComponent;
  let fixture: ComponentFixture<ImportexportT2sComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportexportT2sComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportexportT2sComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
