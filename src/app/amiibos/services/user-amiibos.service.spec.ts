import { TestBed } from '@angular/core/testing';

import { UserAmiibosService } from './user-amiibos.service';

describe('UserAmiibosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserAmiibosService = TestBed.get(UserAmiibosService);
    expect(service).toBeTruthy();
  });
});
