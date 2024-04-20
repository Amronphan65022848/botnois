import { Injectable } from '@angular/core';
import { Observable, Subject, interval, throwError } from 'rxjs';
import { take } from 'rxjs/operators';

import * as TRecordRTC from 'recordrtc';
declare let RecordRTC: any;

declare const window: any;

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class AudioRecordService {
  private stream: MediaStream;
  private recorder: TRecordRTC;
  private interval: Observable<number>;
  private startTime = new Date();
  private recorded = new Subject<RecordedAudioOutput>();
  private recordingTime = new Subject<string>();
  private getRecordingFailed = new Subject<string>();
  blob: Observable<any>;

  constructor() {

  }

  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this.recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this.recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this.getRecordingFailed.asObservable();
  }

  startRecording(): void {
    //get status access
    this.accessMicrophone()

    if (this.recorder) {
      // It means recording is already started or it is already recording something
      // console.log('It means recording is already started or it is already recording something');
      return;
    }
    try {
      // console.log("try condition");
      this.recordingTime.next('00:00');
      navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
        this.stream = s;

        this.record();
      }).catch(error => {
        this.getRecordingFailed.next(null);
      });

    } catch (error) {
      // console.log("catch condition");
      throwError(error)
    }

  }

  accessMicrophone() {
    const body = {
      name: "microphone" as PermissionName
    }
    navigator.permissions.query(body).then(function (result) {
      if (result.state == 'denied') {
        if (window.confirm('คุณได้ปฏิเสธการใช้ไมค์บนเว็บไซต์ของเรา เรียนรู้เพิ่มเติมได้โดยการคลิกปุ่ม OK')) {
          window.open("https://support.google.com/chrome/answer/2693767?hl=th&co=GENIE.Platform%3DAndroid", "_blank")
        }
      }
    });
  }

  abortRecording(): void {
    this.stopMedia();
  }

  private record(): void {
    try {
      this.recorder = new RecordRTC(this.stream, {
        type: 'audio',
        mimeType: 'audio/webm',
      });

      this.recorder.startRecording();
      this.startTime = new Date(); // Use the Date object for the start time

      this.interval = interval(1000).pipe(
        take(10), // Adjust the number of times the interval should run
      );

      this.interval.subscribe(() => {
        const currentTime = new Date();

        // Handle null
        if (!this.startTime) return;
        const diffTime = new Date(currentTime.getTime() - this.startTime.getTime());

        const minutes = this.toString(Math.floor(diffTime.getTime() / 60000));
        const seconds = this.toString(Math.floor((diffTime.getTime() % 60000) / 1000));

        const time = minutes + ':' + seconds;
        console.log(time);

        this.recordingTime.next(time);
      });
    } catch (error) {
      console.error(error);
    }
  }


  private toString(value: any): void {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording(): void {
    // this.recorder.stop()
    // this.recorder.ondataavailable = this.handleDataAvailable
    // this.recorded.next({ blob:'this.blob', title: 'mp3Name' });
    try {
      if (this.recorder) {
        this.recorder.stopRecording(() => {

          let blob = this.recorder.getBlob()
          if (this.startTime) {
            // this.datePipeString = this.datePipe.transform(Date.now(), 'd-M-yyyy_h-mm-ss');
            const mp3Name = encodeURIComponent('audio_' + new Date().getTime());
            this.stopMedia();
            this.recorded.next({ blob, title: mp3Name });
          }
        })
      }
    } catch (error) {
      throwError(error)
    }

  }

  private stopMedia(): void {
    if (this.recorder) {
      this.recorder = null;
      this.interval.subscribe().unsubscribe()
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach((track: { stop: () => any; }) => track.stop());
        this.stream = null;
      }
    }
  }

  // observe

  handleDataAvailable(event: any) {
    if (event.data.size > 0) {

      //  return this.blob = of(event.data);


    }
  }



}
