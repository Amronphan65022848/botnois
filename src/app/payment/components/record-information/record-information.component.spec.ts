import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordInformationComponent } from './record-information.component';

describe('RecordInformationComponent', () => {
  let component: RecordInformationComponent;
  let fixture: ComponentFixture<RecordInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
