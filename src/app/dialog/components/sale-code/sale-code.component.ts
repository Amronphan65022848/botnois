import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { WalletService } from 'src/app/payment/services/wallet.service';
import { DialogService } from '../../services/dialog.service';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { language } from 'src/app/shared/change_language/language';
@Component({
  selector: 'app-sale-code',
  standalone: true,
  imports: [],
  templateUrl: './sale-code.component.html',
  styleUrl: './sale-code.component.scss',
})
// this.saleCode.sales.warning,
export class SaleCodeComponent {
  text = language['TH'].dialogPaid;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public cookie: CookieService,
    private walletService: WalletService,
    private _dialog: DialogService,
    private _changelanguage: ChangeLanguageService
  ) {
    this.route.queryParams.subscribe((res: any) => {
      sessionStorage.setItem('_bn_seller_code', String(res.code));
      if (sessionStorage.getItem('_bn_seller_code')) {
        setTimeout(() => {
          this.checkSaleCode();
          this.router.navigate(['/payment']);
        }, 0);
      }
    });
  }
  ngOnInit(): void {
    this._changelanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].dialogPaid;
      }
    });
  }
  private checkSaleCode() {
    const sellerCode = sessionStorage.getItem('_bn_seller_code');
    const text_sale = this.text.sales.warning;
    this.walletService.checkSaleCodeName(sellerCode).subscribe((response) => {
      if (response.status === 404) {
        this._dialog.saleCodeWorng(text_sale);
        sessionStorage.removeItem('_bn_seller_code');
      }
    });
  }
}
