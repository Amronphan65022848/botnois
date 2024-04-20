import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EN } from '../../change_language/EN';
import { TH } from '../../change_language/TH';
import { ChangeLanguageService } from '../../services/change-language.service';
import { SharedApiService } from '../../services/shared-api.service';
import { catchError } from 'rxjs/operators';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmTextComponent } from 'src/app/dialog/components/confirm-text/confirm-text.component';
import { language } from '../../change_language/language';
import { TitleMetaService } from '../../services/title-meta.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css'],
})
export class AgreementComponent implements OnInit {
  public showprivacy: any = false;
  public isAgreement: string | null = localStorage.getItem('_A');
  public isLogin: boolean = null;

  isAccepted = false;
  isLoading = false;
  isDeleteState = false;
  constructor(
    public _auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private _changelanguage: ChangeLanguageService,
    private _sharedAPI: SharedApiService,
    private _dialog: DialogService,
    private dialog: MatDialog,
    private meta: TitleMetaService,
  ) { }

  ngOnInit(): void {
    this.meta.noIndexMeta()

    this.getQueryParams();

    this._changelanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].agreementObj;
      }
    });

    if (this._auth.getToken()) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
  }

  /** Get token by queryparams */
  getQueryParams() {
    this.route.queryParams.subscribe((resp) => {
      // Passed when JSON has the token key
      if (resp['state'] === 'delete') {
        this.isDeleteState = true;
      }
    });
  }

  deleteFacebookAccount() {
    this.dialog
      .open(ConfirmTextComponent, {
        data: this.text.confirm_dialog,
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp === true) {
          this._auth
            .deleteAccount()
            .pipe(
              catchError((err) => {
                this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
                return err;
              })
            )
            .subscribe((resp) => {
              if (resp.status === 200) {
                this._auth.logOut(); // Force logout
              } else {
                this._dialog.error(resp.message);
              }
            });
        }
      });
  }

  agreement() {
    localStorage.setItem('_A', 'true');
    this.router.navigate(['/tts']);
  }

  onSubmit() {
    this.isLoading = true;
    this._sharedAPI.fetchAgreement().subscribe((res) => {
      if (res) {
        this.router.navigate(['/tts/conversation']);
        const user = this._auth.data.getValue();
        user.agreement = true;
        this._auth.data.next(user);
      }
      this.isLoading = false;
    });
  }

  onBack() {
    this.router.navigate(['']);
    if (!this.isDeleteState) {
      this._auth.logOut(); // Force user logout
    }
  }

  text = null;
}
