import { Component, OnInit } from '@angular/core';
import { AudioStorageApiService } from '../../../storage/services/audio-storage-api.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(
    private _audioStorageApi: AudioStorageApiService,
  ) {
    // _audioStorageApi.isAudioPlayerPath.next(true)
  }

  ngOnInit(): void {
  }

}
