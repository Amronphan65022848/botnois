import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ParamObj, SocialText } from "../models/auth-model";

/* confirmation success */
const paramObj : ParamObj = {
  page: "",
  token: "",
  type: "",
  email: "",
}

const TH_confirmText = ['การสมัครเสร็จสมบูรณ์','เปลี่ยนรหัสผ่านใหม่เสร็จสมบูรณ์ !','ยืนยันอีเมลของคุณ','เกิดข้อผิดพลาด กรุณาลองใหม่'];
const EN_confirmText = ['Application Completed','Password change complete. !', 'Verify your email', 'Error. Please try again'];

/* social */
const TH_socialTextObj: SocialText = {
  submit: ['ลงชื่อเข้าใช้งาน','สร้างบัญชีผู้ใช้งาน'],
  noAccount: {
    text: ['ยังไม่มีบัญชีใช่ไหม?','มีบัญชีกับเราแล้ว?'],
    href: ['สร้างบัญชีใช้งานฟรี','ล็อกอินเข้าสู่ระบบ']
  }
}

const EN_socialTextObj: SocialText = {
  submit: ['Login', 'Create account'],
  noAccount: {
    text: ['Don\'t have an account?','Have an account with us?'],
    href: ['Create Free Account', 'Login']
  }
}

/* forgot password */
const TH_forgotPasswordObj = {
  header: ['ลืมรหัสผ่าน','ตั้งรหัสผ่านใหม่'],
  newpassword: {
    sub: 'สร้างรหัสผ่านใหม่ที่มีความยาวไม่ต่ำกว่า 8 ตัวอักษร รหัสผ่านที่ปลอดภัยจะประกอบด้วยตัวอักษร ตัวเลข และเครื่องหมายวรรคตอน',
  }
}

const EN_forgotPasswordObj = {
  header: ['Forgot Password', 'Reset Password'],
  newpassword: {
    sub: 'Create a new password at least 8 characters long, secure passwords contain letters, numbers and punctuation',
  }
}



const emailControl = new FormControl<any>('',[
  Validators.required,
  Validators.email
])

const resetPasswordForm = new FormGroup<any>({
  password: new FormControl('',[
    Validators.required,
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),
  ]),
  confirm_password: new FormControl('',[
    Validators.required,
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),
  ]),
})

/* sign in */
const signInForm = new FormGroup<any>({
  email: new FormControl('',[
    Validators.required,
    Validators.email
  ]),
  password: new FormControl('',[
    Validators.required,
  ]),
  remember_password: new FormControl(false),
})

const signInError = {
  'This email is not verified!': 'อีเมลไม่ได้รับการยืนยัน โปรดตรวจสอบอีเมลของคุณ',
  'Email is not valid': 'อีเมลของท่านไม่อยู่ในระบบ',
  'Incorrect email or password.': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
}

/* sign up */
const signUpForm = new FormGroup<any>({
  firstname: new FormControl('',[
    Validators.required
  ]),
  lastname: new FormControl('',[
    Validators.required
  ]),
  birthdate: new FormControl('',[
    Validators.required
  ]),
  career: new FormControl('',[
    Validators.required
  ]),
  career_optional: new FormControl(''),
  email: new FormControl('',[
    Validators.required,
    Validators.email
  ]),
  password: new FormControl('',[
    Validators.required,
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),
  ]),
})

const TH_careerArray = [
  'Content Creator',
  'Video Editor',
  'Youtuber',
  'คุณครู / อาจารย์',
  'นักพากย์',
  'นักการตลาด',
  'นักเขียนนิยาย',
  'นักพัฒนาซอฟแวร์',
  'อื่นๆ',
]

const EN_careerArray = [
  'Content Creator',
  'Video Editor',
  'Youtuber',
  'Teacher/Teacher',
  'Voice Actor',
  'Marketer',
  'Fiction Writer',
  'Software Developer',
  'other',
]

const signUpError = {
  'Email is already taken': 'อีเมลถูกใช้ไปแล้ว',
}

export const authObj = {
  social: {
    TH_socialTextObj: TH_socialTextObj,
    EN_socialTextObj: EN_socialTextObj,
  },
  forgotPassword: {
    emailControl: emailControl,
    resetPasswordForm: resetPasswordForm,
    TH_forgotPasswordObj: TH_forgotPasswordObj,
    EN_forgotPasswordObj: EN_forgotPasswordObj,
  },
  signIn: {
    signInForm: signInForm,
    signInError: signInError,
  },
  signUp: {
    signUpForm: signUpForm,
    signUpError: signUpError,
    TH_careerArray: TH_careerArray,
    EN_careerArray: EN_careerArray,
  },
  confirm: {
    paramObj: paramObj,
    TH_confirmText: TH_confirmText,
    EN_confirmText: EN_confirmText,
  }
}

