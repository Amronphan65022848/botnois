import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverToolComponent } from './conver-tool.component';

describe('ConverToolComponent', () => {
  let component: ConverToolComponent;
  let fixture: ComponentFixture<ConverToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConverToolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConverToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
