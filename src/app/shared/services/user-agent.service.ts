import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAgentService {

  constructor(
    private platform: Platform 
  ) { }

  getAgent(){
    if(this.platform.ANDROID || this.platform.IOS == true){
      return true
    } else {
      return false
    }
  }
  getIOS(){
    return this.platform.IOS
  }
}
