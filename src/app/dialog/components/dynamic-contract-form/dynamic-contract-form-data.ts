import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogImage } from '../../../model/core-model';


const placeholderList = [
  'ชื่อจริง - นามสกุล',
  'ชื่อหน่วยงาน',
  'เบอร์โทรศัพท์ติดต่อ',
  'อีเมลติดต่อ',
  'รายละเอียดเพิ่มเติม'
]

const form = new FormGroup<any>({
  fullname: new FormControl('',[
    Validators.required
  ]),
  department: new FormControl('',[
    Validators.required
  ]),
  phone: new FormControl('',[
    Validators.required,
    Validators.pattern('[- +()0-9]+')
  ]),
  email: new FormControl('',[
    Validators.required,
    Validators.email
  ]),
  description: new FormControl(''),
})

const dialogImageJs: DialogImage = {
  title: 'ส่งข้อมูลเรียบร้อยแล้ว',
  text: 'ระบบได้ทำการส่งข้อมูลของท่านเรียบร้อยแล้ว',
  image: '../../assets/icons/confirm.svg',
  width: '74px',
  height: '74px',
  confirmButtonText: 'ปิดหน้าต่างนี้',
}

export const DynamicContractFormData = {
  form: form,
  placeholderList: placeholderList,
  dialogImageJs: dialogImageJs
}


