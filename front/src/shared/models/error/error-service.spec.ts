import { TestBed } from '@angular/core/testing';

import { Error } from './error-service';

describe('Error', () => {
  let service: Error;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Error);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
