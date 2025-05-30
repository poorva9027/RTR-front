import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthService } from '../Services/auth.service';

describe('authGuard', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
