import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AmiiboItemComponent } from './components/amiibo-item/amiibo-item.component';
import { AmiibosListComponent } from './components/amiibos-list/amiibos-list.component';
import { SelectSeriesModalComponent } from './components/select-series-modal/select-series-modal.component';
import { SelectSeriesModalService } from './components/select-series-modal/select-series-modal.service';
import { AmiibosFirestore } from './services/amiibos.firestore';
import { AmiibosService } from './services/amiibos.service';
import { UserAmiibosFirestore } from './services/user-amiibos.firestore';
import { UserAmiibosLocalStorage } from './services/user-amiibos.local-storage';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        ReactiveFormsModule
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
        SelectSeriesModalService,
        AmiibosFirestore,
        UserAmiibosFirestore,
        UserAmiibosLocalStorage,
        AmiibosService
    ]
})
export class AmiibosModule {}
