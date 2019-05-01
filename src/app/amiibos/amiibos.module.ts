import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AmiibosPage } from './amiibos.page';
import { SelectSeriesComponent } from './select-series.component';

const routes: Routes = [
  {
    path: '',
    component: AmiibosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AmiibosPage,
    SelectSeriesComponent
  ],
  entryComponents: [SelectSeriesComponent]
})
export class AmiibosPageModule {}
