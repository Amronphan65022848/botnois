import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadSigleComponent } from './download-sigle.component';

describe('DownloadSigleComponent', () => {
  let component: DownloadSigleComponent;
  let fixture: ComponentFixture<DownloadSigleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadSigleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DownloadSigleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
