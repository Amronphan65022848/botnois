import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Output, type OnInit, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TypeCurrency } from 'src/app/shared/models/shared-model';
import { analyticId } from 'src/app/shared/mocks/analyticId-mock';

type TInputPoint = {
  input: string;
  btn: string;
}
@Component({
  selector: 'app-input-point',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './input-point.component.html',
  styleUrls: ['./input-point.component.scss'],
})
export class InputPointComponent implements OnInit {

  @Input() text: any
  @Input() analyticId: TInputPoint
  @Input() currency: TypeCurrency
  @Input() pointForm: FormControl<number>
  @Input() price: number
  @Output() onTopup = new EventEmitter<null>(null)

  constructor() { }

  ngOnInit(): void {

  }

  public limitNumber() {
    const point = this.pointForm.value
    const max = 100000000

    if (point >= max) {
      this.pointForm.setValue(max)
    }
  }

  topup() {
    this.onTopup.emit()
  }
}
