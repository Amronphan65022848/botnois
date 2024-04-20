import { Component, OnInit } from '@angular/core';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { ComponentQueueService } from '../../services/component-queue.service';
import { language } from 'src/app/shared/change_language/language';
import { contactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  public formData = {
    name: '',
    company: '',
    email: '',
    phone: '',
    details: '',
  };

  public text = null;

  constructor(
    private _compontentQueue: ComponentQueueService,
    private _changeLanguage: ChangeLanguageService,
    private contactService: contactService
  ) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].landingPageV3Obj.contact;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._compontentQueue.$componentsLoaded.next(7);
    }, 5000);
  }

  onSubmit() {
    this.contactService
      .contactSendLanding(this.formData)
      .subscribe((res: any) => {
        console.log(res);
      });
  }
}
