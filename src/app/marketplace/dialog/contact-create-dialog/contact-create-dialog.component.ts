import { Component, ElementRef, Renderer2 } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-contact-create-dialog',
  templateUrl: './contact-create-dialog.component.html',
  styleUrls: ['./contact-create-dialog.component.scss'],
})
export class ContactCreateDialogComponent {
  form: FormGroup;

  public name: string = null;
  public surName: string = null;
  public email: string = null;
  public phone: number = null;
  public service: string = null;
  public oreganizationName: string = null;

  public languageSubscription;
  public text = null;
  public lang = null;

  constructor(
    private dialogRef: MatDialogRef<ContactCreateDialogComponent>,
    private _changeLanguage: ChangeLanguageService,
    private fb: FormBuilder,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

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
      // service: ['personal', Validators.required],
      // oreganizationName: ['', this.organizationNameValidator],
    });

    // Subscribe to changes in the 'service' control to update the validation of 'oreganizationName'
    // this.form.get('service').valueChanges.subscribe(() => {
    //   this.form.get('oreganizationName').updateValueAndValidity();
    // });

    // // Listen to the keydown event on the form
    // this.renderer.listen(this.elementRef.nativeElement, 'keydown', (event) => {
    //   // Check if the pressed key is Enter
    //   if (event.key === 'Enter') {
    //     // Prevent the default behavior (closing the dialog)
    //     if (this.form.valid) {
    //       this.onSubmit();
    //     } else {
    //       event.preventDefault();
    //     }
    //   }
    // });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    // this._unsub.complete();
  }

  // Custom validator for 'oreganizationName'
  // private organizationNameValidator(
  //   control: AbstractControl
  // ): ValidationErrors | null {
  //   const serviceControl = control.parent?.get('service');

  //   // Check if the 'service' control has the value 'organization'
  //   if (serviceControl?.value === 'organization' && !control.value) {
  //     return { requiredIfOrganization: true };
  //   }

  //   return null;
  // }

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
