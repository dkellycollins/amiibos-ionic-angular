import { TestBed } from '@angular/core/testing';

import { AmiibosService } from './amiibos.service';

describe('AmiibosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AmiibosService = TestBed.get(AmiibosService);
    expect(service).toBeTruthy();
  });
});
