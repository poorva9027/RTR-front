import { TestBed } from '@angular/core/testing';

import { OnlyLettersValidationService } from './only-letters-validation.service';

describe('OnlyLettersValidationService', () => {
  let service: OnlyLettersValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlyLettersValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
