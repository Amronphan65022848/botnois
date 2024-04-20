import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentComponent } from './payment.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { DialogService } from '../dialog/services/dialog.service';
import { ChangeLanguageService } from '../shared/services/change-language.service';
import { GlobalFunctionService } from '../shared/services/global-function.service';
import { ScreenSizeService } from '../shared/services/screen-size.service';
import { TitleMetaService } from '../shared/services/title-meta.service';
import { AdsService } from '../voice/services/ads.service';
describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentComponent],
      providers: [
        MatDialog,
        Router,
        AuthService,
        ChangeLanguageService,
        GlobalFunctionService,
        DialogService,
        ScreenSizeService,
        AdsService,
        TitleMetaService,
        // ActivatedRoute is provided with a mocked value
        { provide: ActivatedRoute, useValue: { queryParams: new Subject() } }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // beforeEach(() => MockBuilder(PaymentComponent, PaymentModule));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(PaymentComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   // 2. customizing mocks, configuring inputs, etc
  //   // nothing to do

  //   // 3. creating a fixture
  //   const fixture = MockRender(PaymentComponent);

  //   // 4. asserting expectations
  //   expect(fixture.point.componentInstance).toBeDefined();
  // });

});
