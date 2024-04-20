import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChangeLanguageService } from '../../shared/services/change-language.service';
import { DialogService } from '../../dialog/services/dialog.service';

import { TextspeechService } from '../../shared/services/textspeech.service';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { language } from 'src/app/shared/change_language/language';
import { environment } from 'src/environments/environment';
const { api } = environment
@Component({
  selector: 'app-api-tutorial',
  templateUrl: './api-tutorial.component.html',
  styleUrls: ['./api-tutorial.component.scss']
})
export class ApiTutorialComponent implements OnInit {
  audioUrl = ""
  apiUrl = api + "/openapi/v1/generate_audio"
  isLoading = false
  credentials = ''
  paramKeys = ['']
  apiJson = {
    text: 'Your Text',
    speaker: '1',
    volume: 1,
    speed: 1,
    type_media: "m4a",
    save_file: true,
    // "language": 'th'
  }
  speakers = []

  langaugeSelected = 0
  programingLanguages = ['Golang', 'Python', 'NodeJS']
  codeTexts = ['']
  testForm = new FormGroup<any>({
    text: new FormControl('ทดสอบเอพีไอ', [
      Validators.required
    ]),
    speaker: new FormControl('meena', [
      Validators.required
    ]),
  })

  text = null
  lang: string = null // Language variable
  constructor(
    private _tts: TextspeechService,
    private snackbar: MatSnackBar,
    private _dialog: DialogService,
    private _speaker: SpeakerService,
    private _changeLanguage: ChangeLanguageService,
  ) {

  }

  ngOnInit(): void {
    this._changeLanguage.language.subscribe(
      res => {
        if (res) {
          this.text = language[res].apitutorialObj
          this.lang = res
        }
      }
    )

    setTimeout(() => {
      this.speakers = this._speaker.getSpeaker().filter(e => e.speaker_id !== '999').sort((a, b): any => Number(a.speaker_id) - Number(b.speaker_id))
    }, 500);

    this.paramKeys = Object.keys(this.testForm.value) //assign keys
    this.isLoading = true //loading before fetching api
    this._tts.checkToken()
      .pipe(
        catchError(err => {
          this.isLoading = false
          this._dialog.somethingWentWrong()
          return throwError(err)
        })
      )
      .subscribe(
        (res: any) => {
          this.isLoading = false
          if (res) {
            const token: string = res.data[0].token
            this.credentials = token.replace('Bearer ', '')

            this.assignText2Arr()
          }

        }
      )

  }

  onLanguageSelected(i: number) {
    this.langaugeSelected = i
  }

  reCredentials() {
    this.isLoading = true
    this._tts.reToken()
      .pipe(
        catchError(
          err => {
            this.isLoading = false
            return throwError(err)
          }
        )
      )
      .subscribe(
        (res: any) => {
          this.isLoading = false
          if (res) {
            this.credentials = res.data[0].token
            this.assignText2Arr()
          }
        }
      )
  }

  assignText2Arr() {

    this.codeTexts = [
      `
      package main
      import (
        "bytes"
        "encoding/json"
        "fmt"
        "io/ioutil"
        "net/http"
      )

      func main() {

        url := "`+ this.apiUrl + `"
        method := "POST"

        var payload = map[string]string{"text": "Your Text", "speaker": "1", "volume": "1", "speed": "1", "type_media": "m4a", "save_file": "true", "language": "th"}
        jsonValue, _ := json.Marshal(payload)

        client := &http.Client{}
        req, err := http.NewRequest(method, url, bytes.NewBuffer(jsonValue))

        req.Header.Add("Botnoi-Token", "` + this.credentials + `")
        req.Header.Add("Content-Type", "application/json")
        res, err := client.Do(req)
        if err != nil {
          panic(err)
        }
        defer res.Body.Close()

        body, _ := ioutil.ReadAll(res.Body)
        fmt.Println("response: ", string(body))
      }
      `
      ,
      `
      import requests
      url = "` + this.apiUrl + `"
      payload = {"text":"Your Text", "speaker":"1", "volume":1, "speed":1, "type_media":"m4a", "save_file": "true", "language": "th"}
      headers = {
        'Botnoi-Token': '`+ this.credentials + `',
        'Content-Type': 'application/json'
      }
      response = requests.request("POST", url, headers=headers, json=payload)
      print(response.content)
      `,
      `
      var request = require('request');
      var options = {
        'method': 'POST',
        'url' : "` + this.apiUrl + `",
        body : JSON.stringify({"text":"Your Text", "speaker":"1", "volume":1, "speed":1, "type_media":"m4a", "save_file": "true", "language": "th"}),
        headers : {
          'Botnoi-Token': '`+ this.credentials + `',
          'Content-Type': 'application/json'
        }
      };
      request(options, function (error, response) {
        if (error) throw new Error((error))
        console.log(response.body);
      });
      `
    ]
  }

  onCopy() {
    this.snackbar.open(this.text.redirect.copyComplete, '', {
      panelClass: ['snackbar-success'],
      duration: 3000
    })
  }
}
