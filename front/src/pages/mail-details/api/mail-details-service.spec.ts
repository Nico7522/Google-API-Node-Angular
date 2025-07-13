import { TestBed } from '@angular/core/testing';

import { MailDetailsService } from './mail-details-service';

describe('MailDetailsService', () => {
  let service: MailDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
