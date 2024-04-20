import { Component } from '@angular/core';

@Component({
  selector: 'app-advice-co-project',
  templateUrl: './advice-co-project.component.html',
  styleUrls: ['./advice-co-project.component.scss'],
})
export class AdviceCoProjectComponent {
  public isAdviceShow: boolean = false;

  toggleAdvice() {
    this.isAdviceShow = !this.isAdviceShow;
  }
}
