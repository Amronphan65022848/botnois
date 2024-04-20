import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  type OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserData } from 'src/app/auth/models/auth-model';
import { SubscriptionAPIService } from 'src/app/payment/services/subscription-api.service';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { SubscriptionPackage } from 'src/app/payment/models/subscription-model';

@Component({
  selector: 'app-dialog-reset-subscription',
  templateUrl: './dialog-reset-subscription.component.html',
  styleUrls: ['./dialog-reset-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogResetSubscriptionComponent implements OnInit {
  // text = language['TH'].dialogResetsubscription;
  text = null;
  lang = null;
  user: UserData = null;
  isLoading: boolean = false;
  intervalId: any;
  mock_sub = [
    { name: 'Free', monthly_point: 0 },
    { name: 'Basic', monthly_point: 5000 },
    { name: 'Advanced', monthly_point: 20000 },
    { name: 'Pro', monthly_point: 60000 },
    { name: 'Pro plus', monthly_point: 400000 },
  ];

  constructor(
    private _subAPI: SubscriptionAPIService,
    private _language: ChangeLanguageService,
    private dialogRef: MatDialogRef<DialogResetSubscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) data: UserData
  ) {
    this.user = data;
  }

  async ngOnInit(): Promise<void> {
    this._language.language.subscribe((resp) => {
      this.text = language[resp].dialogResetsubscription;
      this.lang = resp;
    });
  }

  calculatePoint(month: number) {
    const result = this.mock_sub.filter((item) => {
      return item.name === this.user.subscription;
    });

    if (!result) {
      return 0;
    }

    return result[0].monthly_point * month;
  }

  onClose() {
    this.dialogRef.close();
  }
}
