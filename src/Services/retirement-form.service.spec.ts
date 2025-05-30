import { TestBed } from '@angular/core/testing';

import { RetirementFormService } from './retirement-form.service';

describe('RetirementFormService', () => {
  let service: RetirementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetirementFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
