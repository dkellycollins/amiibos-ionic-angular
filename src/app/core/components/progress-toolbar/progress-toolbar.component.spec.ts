import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProgressToolbarComponent } from './progress-toolbar.component';

describe('ProgressToolbarComponent', () => {
  let component: ProgressToolbarComponent;
  let fixture: ComponentFixture<ProgressToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ProgressToolbarComponent]
}).compileComponents();

    fixture = TestBed.createComponent(ProgressToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
