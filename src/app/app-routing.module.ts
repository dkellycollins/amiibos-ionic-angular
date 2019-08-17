import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'amiibos', loadChildren: () => import('./amiibos/amiibos.module').then(m => m.AmiibosPageModule) },
  { path: '**', redirectTo: 'amiibos' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
