import { Pipe, PipeTransform } from '@angular/core';

interface SpeakerCondition {
  language: string[];
  voiceStyle: string[];
  speechStyle: string[];
  gender: string[];
}

@Pipe({
  name: 'speakerFilter',
  pure: false, // Mark the pipe as impure (run on every change detection cycle)
})
export class SpeakerFilterPipe implements PipeTransform {
  transform(value: any[], condition: SpeakerCondition): any[] {
    // No value or condition assigning return current value
    if (!value || !condition) {
      return value;
    }
    // console.log(value[0]);

    // Filtering data and return it
    return value.filter((item) => {
      return (
        (condition.gender === undefined ||
          condition.gender.length === 0 ||
          condition.gender.some((style) =>
            item.global_gender.includes(style)
          )) &&
        (condition.language === undefined ||
          condition.language.length === 0 ||
          condition.language.some((style) => item.language.includes(style))) &&
        (condition.speechStyle === undefined ||
          condition.speechStyle.length === 0 ||
          condition.speechStyle.some((style) =>
            item.global_speech_style.includes(style)
          )) &&
        (condition.voiceStyle === undefined ||
          condition.voiceStyle.length === 0 ||
          condition.voiceStyle.some((style) =>
            item.global_voice_style.includes(style)
          ))
      );
    });
  }
}

@Pipe({
  name: 'speakerSearch',
})
export class SpeakerSearchPipe implements PipeTransform {
  transform(value: any[], searchText: string): any[] {
    if (!value) {
      return [];
    }
    if (!searchText) {
      return value;
    }
    searchText = searchText.toLowerCase();

    return value.filter((item) => {
      return item.name.toLowerCase().includes(searchText);
    });
  }
}

@Pipe({
  name: 'marketFilter',
  pure: false, // Mark the pipe as impure (run on every change detection cycle)
})
export class MarketFilterPipe implements PipeTransform {
  transform(value: any[], condition: SpeakerCondition, lang: string): any[] {
    // No value or condition assigning return current value
    if (!value || !condition) {
      return value;
    }

    // Filtering data and return it
    if (lang === 'TH') {
      return value.filter((item) => {
        return (
          (condition.gender === undefined ||
            condition.gender.length === 0 ||
            condition.gender.some(
              (style) =>
                item.gender.includes(style) || item.age_style.includes(style)
            )) &&
          (condition.language === undefined ||
            condition.language.length === 0 ||
            condition.language.some((style) =>
              item.language.includes(style)
            )) &&
          (condition.speechStyle === undefined ||
            condition.speechStyle.length === 0 ||
            condition.speechStyle.some((style) =>
              item.speech_style.includes(style)
            )) &&
          (condition.voiceStyle === undefined ||
            condition.voiceStyle.length === 0 ||
            condition.voiceStyle.some((style) =>
              item.voice_style.includes(style)
            ))
        );
      });
    } else if (lang === 'EN') {
      return value.filter((item) => {
        return (
          (condition.gender === undefined ||
            condition.gender.length === 0 ||
            condition.gender.some(
              (style) =>
                item.eng_gender.includes(style) ||
                item.eng_age_style.includes(style)
            )) &&
          (condition.language === undefined ||
            condition.language.length === 0 ||
            condition.language.some((style) =>
              item.language.includes(style)
            )) &&
          (condition.speechStyle === undefined ||
            condition.speechStyle.length === 0 ||
            condition.speechStyle.some((style) =>
              item.eng_speech_style.includes(style)
            )) &&
          (condition.voiceStyle === undefined ||
            condition.voiceStyle.length === 0 ||
            condition.voiceStyle.some((style) =>
              item.eng_voice_style.includes(style)
            ))
        );
      });
    }
  }
}

@Pipe({
  name: 'marketSearch',
})
export class MarketSearchPipe implements PipeTransform {
  transform(value: any[], searchText: string, lang: string): any[] {
    if (!value) {
      return [];
    }
    if (!searchText) {
      return value;
    }
    searchText = searchText.toLowerCase();

    return value.filter((item) => {
      if (lang === 'TH') {
        return item.thai_name.toLowerCase().includes(searchText);
      } else {
        return item.eng_name.toLowerCase().includes(searchText);
      }
    });
  }
}
