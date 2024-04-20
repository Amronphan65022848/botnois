import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})

// Unsubscribe service for handle memory leaks
export class TitleMetaService {
  constructor(private title: Title, private meta: Meta) { }

  setTitle(title: string) {
    this.title.setTitle(title);
  }

  updateMeta(name: string, description: string) {
    this.meta.updateTag({ name: name, content: description });
  }

  removeMeta(name: string) {
    this.meta.removeTag(`name="${name}"`);
  }

  addMeta(name: string, content: string) {
    this.meta.addTag({ name: name, content: content });
  }

  noIndexMeta() {
    this.meta.addTag({ name: 'robots', content: 'no index' });
  }
}
