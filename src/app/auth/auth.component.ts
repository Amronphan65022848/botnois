import { Component } from '@angular/core';
import { ImageService } from '../shared/services/image.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent {

  constructor(
    _svg: ImageService,
  ) {

  }

  ngOnInit(): void {
    this.test()
  }

  test() {
    return 'Hi'
  }
}
