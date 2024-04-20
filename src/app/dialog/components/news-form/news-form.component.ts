import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-form',
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.scss']
})
export class NewsFormComponent implements OnInit {
  text = null

  dontShow = new FormControl<any>(false)

  localStorageName = 'newsform_notshow'
  days = 7
  image = ''

  user = null
  constructor(
    private dialogRef: MatDialogRef<NewsFormComponent>,
    private _language: ChangeLanguageService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    // Assign dialog data to variable
    this.user = data
  }

  ngOnInit(): void {
    this._language.language.subscribe(
      resp => {
        if(resp) {
          this.text = language[resp].newsObj

          // Check
          if(this.user) {
            let path = null
            if(this.user?.compensate_sub) {
              const rank = String(this.user.subscription).toLowerCase()
              path = `../../../../assets/subscription/pop-up/${rank}_${resp}.webp`
            } else {
              path = `../../../../assets/subscription/pop-up/sub_${resp}.webp`
            }

            // Assign final path to image var
            this.image = path
          }

        }
      }
    )
  }

  /* Set datetime to local storage */
  onDoNotShow() {
    if(this.dontShow.value) return;

    /* Set days */
    const time = String(new Date().getTime() + ((24*60*60*1000)* this.days))
    localStorage.setItem('hideNewsUntil', time);
  }

  onClose() {
    this.dialogRef.close()
  }

  goto() {
    // Check user whice page should navigate
    if(this.user?.compensate_sub) {
      this.router.navigate(['account'], { queryParams: { page: 1}})
    } else {
      this.router.navigate(['payment'])
    }

    // Close dialog
    this.dialogRef.close()
  }

  // goto(){
  //   const temp = this._auth.data.getValue()
  //   if(!temp?.popup && temp?.user_id) {
  //     this._dialogAPI.checkUserClickNews('popup')
  //     .pipe(
  //       catchError( err => {
  //         this.toStripe()
  //         return err
  //       })
  //     )
  //     .subscribe(
  //       () => {
  //         this.toStripe()
  //       }
  //     )
  //   } else {
  //     this.toStripe()
  //   }
  // }

  // toStripe() {
  //   this.router.navigate(['/payment'],{ queryParams: { page: 1}})
  //   this.dialogRef.close()
  // }
}
