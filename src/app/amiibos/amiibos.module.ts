import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AmiibosPage } from './components/amiibos.page';
import { SelectSeriesModalComponent } from './components/select-series-modal.component';
import { AmiiboItemComponent } from './components/amiibo-item/amiibo-item.component';
import { AmiibosListComponent } from './components/amiibos-list/amiibos-list.component';
import { ProgressToolbarComponent } from './components/progress-toolbar/progress-toolbar.component';
import { ProgressBarModule } from 'angular-progress-bar';

const routes: Routes = [
  {
    path: '',
    component: AmiibosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ProgressBarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AmiiboItemComponent,
    AmiibosListComponent,
    ProgressToolbarComponent,
    AmiibosPage,
    SelectSeriesModalComponent
  ],
  entryComponents: [
    SelectSeriesModalComponent
  ]
})
export class AmiibosPageModule {}
