import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AmiibosPage } from './amiibos.page';

const routes: Routes = [
  {
    path: '',
    component: AmiibosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmiibosPageRoutingModule {}
