import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
const { webapi } = environment

@Injectable({
  providedIn: 'root'
})
export class RecordServiceService {

  userid = new BehaviorSubject('')
  categories = new BehaviorSubject('')
  userProgress = new BehaviorSubject(0)
  score = 0
  counter = 0
  constructor(private http: HttpClient) {

  }

  inputCatagoryType(value){
    this.categories.next(value)
  }

  addScoreCounter(s,c){
    this.score += s
    this.counter += c
  }

  updateScoreCounter(s,c){
    this.score = s
    this.counter = c
  }

}
