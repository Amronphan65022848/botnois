import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-warning-user',
  templateUrl: './warning-user.component.html',
  styleUrls: ['./warning-user.component.scss']
})

export class WarningUserComponent implements OnInit {
  constructor(
    private _notify: NotificationService,
    private _route: ActivatedRoute,
    private router: Router,
    public location: Location,
  ) {

  }

  text_from_server: string = ''
  isClose = false

  ngOnInit(): void {
    this._route.queryParams.subscribe(
      param => {
        if(param['id']){
          this.isClose = true
        }
      }
    )
    setTimeout(() => {
      this._notify.getnotifromServer().subscribe((res:any)=>{
        console.log("noti",res);

        this._notify.notifyJson.next(res)
        // ตัว Warning ไม่สามารถ CHange language
        this.text_from_server = res.warning
      });
    }, 3000);
  }

  closeWarn() {
    this.text_from_server = ''
  }
}
