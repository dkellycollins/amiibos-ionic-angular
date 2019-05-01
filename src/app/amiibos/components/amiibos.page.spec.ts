import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmiibosPage } from './amiibos.page';

describe('AmiibosPage', () => {
  let component: AmiibosPage;
  let fixture: ComponentFixture<AmiibosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmiibosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmiibosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
