import { TestBed } from '@angular/core/testing';

import { ParentGuardService } from './parent-guard.service';

describe('ParentGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParentGuardService = TestBed.get(ParentGuardService);
    expect(service).toBeTruthy();
  });
});
