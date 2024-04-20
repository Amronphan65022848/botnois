import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-use-invite',
  templateUrl: './use-invite.component.html',
  styleUrls: ['./use-invite.component.css'],
})
export class UseInviteComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((res: any) => {
      localStorage.setItem('_code', String(res.code));
      if (localStorage.getItem('_code')) {
        setTimeout(() => {
          this.router.navigate(['/tts']);
        }, 0);
      }
      console.log(res.code);
    });
  }

  ngOnInit(): void {}
}
