import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


// Password and confirm passowrd mismatch
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirm_password');

  // If either field is empty, return null (no error)
  if (!password || !confirmPassword) {
    return null;
  }

  // If passwords match, return null (no error)
  if (password.value === confirmPassword.value) {
    return null;
  }

  // If passwords don't match, return error object
  return { passwordMismatch: true };
};
