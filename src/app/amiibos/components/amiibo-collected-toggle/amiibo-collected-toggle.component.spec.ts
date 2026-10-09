import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AmiiboCollectedToggleComponent } from './amiibo-collected-toggle.component';

describe('AmiiboCollectedToggleComponent', () => {
  let component: AmiiboCollectedToggleComponent;
  let fixture: ComponentFixture<AmiiboCollectedToggleComponent>;
  let emittedValues: Array<boolean>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule ],
      declarations: [ AmiiboCollectedToggleComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmiiboCollectedToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    emittedValues = [];
    component.collectedChanged.subscribe((value: boolean) => {
      emittedValues.push(value);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit when the collected input is set', () => {
    component.collected = true;

    expect(component.control.value).toBe(true);
    expect(emittedValues).toEqual([]);
  });

  it('should emit when the toggle value changes', () => {
    component.control.setValue(true);

    expect(emittedValues).toEqual([true]);
  });
});
