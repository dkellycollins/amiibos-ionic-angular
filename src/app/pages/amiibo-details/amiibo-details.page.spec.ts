import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AmiibosService } from 'src/app/amiibos/services/amiibos.service';

import { AmiiboDetailsPage } from './amiibo-details.page';

describe('AmiiboDetailsPage', () => {
  let component: AmiiboDetailsPage;
  let fixture: ComponentFixture<AmiiboDetailsPage>;

  beforeEach(waitForAsync(() => {
    const amiibosServiceStub = {
      allAmiibos$: of([]),
      loadAmiibos: () => of(undefined),
      collectableAmiiboBySlug$: () => of(undefined),
      toggleAmiibo: () => of(undefined)
    };

    const activatedRouteStub = {
      paramMap: of(convertToParamMap({ slug: 'mario' }))
    };

    TestBed.configureTestingModule({
      declarations: [ AmiiboDetailsPage ],
      providers: [
        { provide: AmiibosService, useValue: amiibosServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmiiboDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
