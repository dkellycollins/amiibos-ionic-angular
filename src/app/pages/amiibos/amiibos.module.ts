import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AmiibosPageRoutingModule } from './amiibos-routing.module';
import { AmiibosPage } from './amiibos.page';
import { AmiibosModule } from '../../amiibos/amiibos.module';
import { CoreModule } from 'src/app/core/core.module';

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
