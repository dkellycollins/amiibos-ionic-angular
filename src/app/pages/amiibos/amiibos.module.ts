import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CoreModule } from 'src/app/core/core.module';
import { AmiibosModule } from '../../amiibos/amiibos.module';
import { AmiibosPageRoutingModule } from './amiibos-routing.module';
import { AmiibosPage } from './amiibos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmiibosPageRoutingModule,
    AmiibosModule,
    CoreModule
  ],
  declarations: [AmiibosPage]
})
export class AmiibosPageModule {}
