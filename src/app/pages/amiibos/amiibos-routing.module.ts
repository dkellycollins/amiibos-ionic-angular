import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmiibosPageModule } from './amiibos.module';

import { AmiibosPage } from './amiibos.page';

const routes: Routes = [
  {
    path: 'figures',
    component: AmiibosPage,
    data: {
      type: 'figure'
    }
  },
  {
    path: 'cards',
    component: AmiibosPage,
    data: {
      type: 'card'
    }
  },
  {
    path: '**', redirectTo: 'figures'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmiibosPageRoutingModule {}
