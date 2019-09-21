import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProgressBarModule } from 'angular-progress-bar';
import { AmiiboItemComponent } from './components/amiibo-item/amiibo-item.component';
import { AmiibosListComponent } from './components/amiibos-list/amiibos-list.component';
import { AmiibosPage } from './components/amiibos.page';
import { ProgressToolbarComponent } from './components/progress-toolbar/progress-toolbar.component';
import { SelectSeriesModalComponent } from './components/select-series-modal.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AmiibosService } from './services/amiibos.service';

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
    RouterModule.forChild(routes),
    AngularFirestoreModule
  ],
  declarations: [
    AmiiboItemComponent,
    AmiibosListComponent,
    ProgressToolbarComponent,
    AmiibosPage,
    SelectSeriesModalComponent
  ],
  providers: [
    AmiibosService
  ],
  entryComponents: [
    SelectSeriesModalComponent
  ]
})
export class AmiibosPageModule {}
