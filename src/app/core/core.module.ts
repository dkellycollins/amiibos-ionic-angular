import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ProgressToolbarComponent } from './components/progress-toolbar/progress-toolbar.component';
import { AnimateListChangesDirective } from './directives/animate-list-changes.directive';

@NgModule({
  declarations: [
    ProgressBarComponent,
    ProgressToolbarComponent,
    AnimateListChangesDirective
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ProgressBarComponent,
    ProgressToolbarComponent,
    AnimateListChangesDirective
  ]
})
export class CoreModule { }
