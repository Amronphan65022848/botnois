import { TestBed } from '@angular/core/testing';

import { GlobalFunctionService } from './global-function.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBuilder, MockPipe, MockProvider, MockService } from 'ng-mocks';
import { AppModule } from 'src/app/app.module';

describe('GlobalFunctionService', () => {
  let service: GlobalFunctionService

  beforeEach(() => {
    return MockBuilder(GlobalFunctionService, AppModule)
  });

  beforeEach(() => {
    service = TestBed.inject(GlobalFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should uppercase the first letter of a word', () => {
    const input = 'hello world';
    const expectedResult = 'Hello world';
    const result = service.uppercaseFirst(input);
    expect(result).toEqual(expectedResult);
  });
});

