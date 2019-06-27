import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AmiibosPage } from './components/amiibos.page';
import { SelectSeriesModalComponent } from './components/select-series-modal.component';
import { AmiiboItemComponent } from './components/amiibo-item/amiibo-item.component';

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
    RouterModule.forChild(routes)
  ],
  declarations: [
    AmiibosPage,
    AmiiboItemComponent,
    SelectSeriesModalComponent
  ],
  entryComponents: [SelectSeriesModalComponent]
})
export class AmiibosPageModule {}
