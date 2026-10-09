import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AmiibosModule } from '../../amiibos/amiibos.module';
import { AmiiboDetailsPageRoutingModule } from './amiibo-details-routing.module';
import { AmiiboDetailsPage } from './amiibo-details.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AmiiboDetailsPageRoutingModule,
    AmiibosModule
  ],
  declarations: [AmiiboDetailsPage]
})
export class AmiiboDetailsPageModule {}
