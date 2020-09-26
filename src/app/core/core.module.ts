import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ProgressToolbarComponent } from './components/progress-toolbar/progress-toolbar.component';

@NgModule({
  declarations: [
    ProgressBarComponent,
    ProgressToolbarComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ProgressBarComponent,
    ProgressToolbarComponent
  ]
})
export class CoreModule { }
