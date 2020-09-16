import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AmiiboItemComponent } from './components/amiibo-item/amiibo-item.component';
import { AmiibosListComponent } from './components/amiibos-list/amiibos-list.component';
import { SelectSeriesModalComponent } from './components/select-series-modal/select-series-modal.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { UserAmiibosService } from './services/user-amiibos.service';
import { SelectSeriesModalService } from './components/select-series-modal/select-series-modal.service';
import { NgxsModule } from '@ngxs/store';
import { AmiibosState } from './state/amiibos.state';
import { AmiibosFirestore } from './services/amiibos.firestore';
import { NgxsFirestoreModule } from '@ngxs-labs/firestore-plugin';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AngularFirestoreModule,
    NgxsModule.forFeature([AmiibosState]),
    NgxsFirestoreModule
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
    UserAmiibosService,
    SelectSeriesModalService,
    AmiibosFirestore
  ],
  entryComponents: [
    SelectSeriesModalComponent
  ]
})
export class AmiibosModule {}
