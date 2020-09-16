import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AmiiboItemComponent } from './components/amiibo-item/amiibo-item.component';
import { AmiibosListComponent } from './components/amiibos-list/amiibos-list.component';
import { SelectSeriesModalComponent } from './components/select-series-modal/select-series-modal.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AmiibosService } from './services/amiibos.service';
import { UserAmiibosService } from './services/user-amiibos.service';
import { SelectSeriesModalService } from './components/select-series-modal/select-series-modal.service';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AngularFirestoreModule
  ],
  declarations: [
    AmiiboItemComponent,
    AmiibosListComponent,
    SelectSeriesModalComponent
  ],
  exports: [
    AmiiboItemComponent,
    AmiibosListComponent,
    SelectSeriesModalComponent
  ],
  providers: [
    AmiibosService,
    UserAmiibosService,
    SelectSeriesModalService
  ],
  entryComponents: [
    SelectSeriesModalComponent
  ]
})
export class AmiibosModule {}
