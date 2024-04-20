import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

interface Data {
  text: any;
  icon: string;
  type: string;
}
@Component({
  selector: 'app-payment-flex',
  templateUrl: './payment-flex.component.html',
  styleUrls: ['./payment-flex.component.scss'],
})
export class PaymentFlexComponent {

  constructor(
    private dialogRef: MatDialogRef<PaymentFlexComponent>,
    private routes: Router,
    private cookie: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: Data
  ) { }

  point:string = null;
  addontime:string = null;
  type:number = null;
  package_name:string = null;
  ngOnInit(): void {
    this.point = this.getCookie('_bn_package_point')
    this.addontime = this.getCookie('_bn_package_add_on_day')
    this.type = this.getCookie('_bn_package_type')
    this.package_name = this.getCookie('_bn_package_name')
  }
  getCookie(name: string) {
    const cookieValue = this.cookie.get(name);
    if (
      cookieValue === 'No Ads' || 
      cookieValue === 'More Text'
      ){
      return cookieValue ? cookieValue : null;
      
    }else{
      return cookieValue ? JSON.parse(cookieValue) : null;
    } 
  }
  deleteCookie(name: string): void {
    this.cookie.delete(name, '/');
  }
  clearCookie(){
    this.deleteCookie('_bn_package_point')
    this.deleteCookie('_bn_package_add_on_day')
    this.deleteCookie('_bn_package_type')
    this.deleteCookie('_bn_package_name')
  }
  

  onCancel(type: string) {
    if (type === 'error') {
      const url = 'https://www.facebook.com/texttospeech.botnoi';
      window.open(url, '_blank');
    }
    this.dialogRef.close();
    this.clearCookie()
  }
}
