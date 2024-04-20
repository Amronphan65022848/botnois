import { TestBed } from '@angular/core/testing';

import { FirebaseAuthService } from './firebase-auth.service';
import { MockBuilder } from 'ng-mocks';
import { AppModule } from 'src/app/app.module';

describe('FirebaseAuthService', () => {
  let service: FirebaseAuthService;
  beforeEach(() => {
    return MockBuilder(FirebaseAuthService, AppModule)
  })

  beforeEach(() => {
    service = TestBed.inject(FirebaseAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
