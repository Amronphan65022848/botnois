import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackbarObj } from 'src/app/dialog/mocks/dialog-mock';

@Component({
  selector: 'app-speaker-invite',
  templateUrl: './speaker-invite.component.html',
  styleUrls: ['./speaker-invite.component.scss']
})
export class SpeakerInviteComponent implements OnInit {

  text = {
    invite: "เพิ่ม / ลบ",
    block: "บล็อค",
    placeholder: "กรุณากรอก UID",
    add: "เพิ่ม",
    submit: "บันทึก" ,
    thead: ["คนที่","UID",""]
  }

  // uid = ['1c0660cb-79e1-5b6e-a9e3-006912a7320c','1c0660cb-79e1-5b6e-a9e3-006912a7320c','1c0660cb-79e1-5b6e-a9e3-006912a7320c']
  // invite_list = []
  // block_list = []
  obj = {
    0: [],
    1: []
  }
  mode: 0 | 1 = 0
  constructor(
    private dialogRef: MatDialogRef<SpeakerInviteComponent>,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {

  }

  /* Add UID to Array */
  onAdd(e: HTMLInputElement){
    if(e.value.length >= 36){
      this.obj[this.mode].push(e.value) // Store string uid on Array
      e.value = '' // Reset input value
    } else {
      this.snackbar.open("UID ไม่ถูกต้อง","",snackbarObj.error)
    }
  }

  /* Remove UID in Array */
  onRemove(i:number){
    this.obj[this.mode].splice(i,1)
  }

  /* Send UID of Array to Database by API fetching */
  onSubmit(){
    this.dialogRef.close()
  }

  /* Switch mode between invite and block mode */
  toggleMode(number: 0 | 1){
    this.mode = number
  }

}
