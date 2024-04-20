import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, private _auth: AuthService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params?.page) {
          this._auth.logIn(params.token, params.page);
        } else {
          this._auth.logIn(params.token);
        }
      }
    )
  }

}
