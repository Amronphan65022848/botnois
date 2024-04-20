import { FormGroup, FormControl, Validators } from "@angular/forms";



const personalForm = new FormGroup<any>({
  fullname: new FormControl('',[
    Validators.required
  ]),
  age: new FormControl('',[
    Validators.required
  ]),
  gender: new FormControl('',[
    Validators.required
  ]),
  province: new FormControl('',[
    Validators.required
  ]),
  career: new FormControl('',[
    Validators.required
  ]),
  use_for: new FormControl('',[
    Validators.required
  ]),
  get_by: new FormControl('',[
    Validators.required
  ]),
  overall_usage: new FormControl(-1,[
    Validators.required,
    Validators.min(0)
  ]),
  easy_use: new FormControl(-1,[
    Validators.required,
    Validators.min(0)
  ]),
  fulfill_need: new FormControl(-1,[
    Validators.required,
    Validators.min(0)
  ]),
  overall_usage_comment: new FormControl(''),
  easy_use_comment: new FormControl(''),
  fulfill_need_comment: new FormControl(''),
  refer_friends: new FormControl('',[
    Validators.required
  ]),
  improve_system: new FormControl(''),
  callback: new FormControl('',[
    Validators.required
  ]),
})

const buttonStatusObj = {
  2: ["fullname","age","gender","province"],
  3: ["career"],
  4: ["use_for"],
  5: ["get_by"],
  6: ["overall_usage","easy_use"],
  7: ["fulfill_need"],
  8: ["refer_friends","improve_system"],
  9: ["callback"],
}

export const personalFormObj = {
  personalForm: personalForm,
  buttonStatusObj: buttonStatusObj,
}
