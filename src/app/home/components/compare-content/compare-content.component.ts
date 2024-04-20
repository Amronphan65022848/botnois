import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseAuthComponent } from 'src/app/firebase-auth/firebase-auth.component';
import { WalletService } from 'src/app/payment/services/wallet.service';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-compare-content',
  templateUrl: './compare-content.component.html',
  styleUrls: ['./compare-content.component.scss'],
})
export class CompareContentComponent implements OnInit {
  public isMobile: boolean;
  public lang: string;
  public text: any;
  public textCard: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 728) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  constructor(
    private _language: ChangeLanguageService,
    private router: Router,
    public _wallet: WalletService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    if (window.innerWidth < 728) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }

    this._language.language.subscribe((res) => {
      if (res) {
        this.lang = res;
        this.text = language[res].landingPageObj;
        this.textCard = language[res].landingPageV3Obj.compare;
      }
    });
  }

  onSignIn() {
    this.dialog.open(FirebaseAuthComponent)
  }

  private goToPaymentPage() {
    this.router.navigate(['/payment/quote']);
  }
}
