import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { language } from 'src/app/shared/change_language/language';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-buy-dialog',
  templateUrl: './contact-buy-dialog.component.html',
  styleUrls: ['./contact-buy-dialog.component.scss'],
})
export class ContactBuyDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;

  public selectedVoice: string = null;

  public name: string = null;
  public surName: string = null;
  public email: string = null;
  public phone: number = null;

  public languageSubscription;
  public text = null;
  public lang = null;

  public allPremium: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<ContactBuyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _changeLanguage: ChangeLanguageService,
    private fb: FormBuilder,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.allPremium = data.all;
    this.selectedVoice = data.selected;
  }

  ngOnInit() {
    this.languageSubscription = this._changeLanguage.language.subscribe(
      (res) => {
        if (res) {
          // this.text = language[res].marketplaceV3Obj.dialog_contact_buy;
          this.lang = res;
        }
      }
    );

    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      line: [''],
      voiceName: [this.selectedVoice],
    });

    // Listen to the keydown event on the form
    this.renderer.listen(this.elementRef.nativeElement, 'keydown', (event) => {
      // Check if the pressed key is Enter
      if (event.key === 'Enter') {
        // Prevent the default behavior (closing the dialog)
        if (this.form.valid) {
          this.onSubmit();
        } else {
          event.preventDefault();
        }
      }
    });
  }

  ngOnDestroy(): void {}

  onClose() {
    this.dialogRef.close(null);
  }

  onSubmit() {
    if (this.form.valid) {
      // console.log('VALID', this.form.value);
      this.dialogRef.close(this.form.value);
    } else {
      // console.log('INVALID', this.form.value);
      return;
    }
  }
}
