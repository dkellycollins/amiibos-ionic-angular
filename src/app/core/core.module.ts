import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressToolbarComponent } from './components/progress-toolbar/progress-toolbar.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { IonicModule } from '@ionic/angular';



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
