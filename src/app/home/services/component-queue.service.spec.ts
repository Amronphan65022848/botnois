import { TestBed } from '@angular/core/testing';

import { ComponentQueueService } from './component-queue.service';

describe('ComponentQueueService', () => {
  let service: ComponentQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
