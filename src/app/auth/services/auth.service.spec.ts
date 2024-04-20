import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { MockBuilder } from 'ng-mocks';
import { AppModule } from 'src/app/app.module';
import { AuthComponent } from '../auth.component';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    return MockBuilder(AuthService, AppModule)
  })

  beforeEach(() => {
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
