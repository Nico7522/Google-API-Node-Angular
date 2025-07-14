import { TestBed } from '@angular/core/testing';

import { MailsFilterService } from './mails-filter-service';

describe('MailsFilterService', () => {
  let service: MailsFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailsFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
