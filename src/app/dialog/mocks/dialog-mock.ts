import { MatSnackBarConfig } from "@angular/material/snack-bar";
import { DialogImage3Texts } from "../models/dialog-model";

/* point transfer */
export const dialogImage3TextsObj: DialogImage3Texts = {
  h: 'ไม่สามารถโอนพอยท์ได้',
  sub: 'เนื่องจากบัญชีผู้รับเหลือสิทธิในการรับพอยท์ $point พอยท์',
  content: 'ต้องการโอน $point พอยท์หรือไม่',
  btn: ['ยกเลิก','ตกลง']
}

const snackbarSuccess: MatSnackBarConfig = {
  duration: 2000,
  panelClass: 'snackbar-success',
  verticalPosition: 'top',
  horizontalPosition: 'right',
}

const snackbarError: MatSnackBarConfig = {
  duration: 2000,
  panelClass: 'snackbar-error',
  verticalPosition: 'top',
  horizontalPosition: 'right',
}

export const snackbarObj = {
  success: snackbarSuccess,
  error: snackbarError
}
