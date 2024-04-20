import { Injectable } from '@angular/core';
import { TResponseAds } from 'src/app/payment/models/ads-model';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';

@Injectable({
  providedIn: 'root',
})
export class GenerateService {
  constructor(private _tts: TextspeechService) {}

  /**
   * Get file from stored global variable.
   * @param text
   * @param speaker
   * @param language
   * @returns
   */
  getfileStorage(
    text: string,
    speaker: string | undefined,
    language: string,
    id: string,
  ) {
    const _text = text.trim();
    const result = this._tts.file
      .getValue()
      .find(
        (item) =>
          item.text == _text &&
          item.speaker == speaker &&
          item.language == language &&
          item._id === id,
      );
    return result;
  }

  // TEST NEW FLOW
  /**
   * Storing file in global variable.
   * @param _text
   * @param speaker
   * @param file
   * @param language
   * @param ads
   * @param isDownload
   */
  setfileStorage(
    _text: string,
    speaker: string | undefined,
    file: string,
    _id: string,
    language?: string,
    ads?: TResponseAds,
  ) {
    const text = _text.trim();
    let data = [{ text, speaker, file, language, ads, _id }];

    // Ads existed then add key
    if (ads) data['ads'] = ads;
    this._tts.file.next([...this._tts.file.getValue(), ...data]);
  }
}
