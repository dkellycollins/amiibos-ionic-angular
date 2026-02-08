import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'amiibos',
    children: [
      {
        path: 'figures',
        loadComponent: () => import('./pages/amiibos/amiibos.page').then(m => m.AmiibosPage),
        data: { type: 'figure' }
      },
      {
        path: 'cards',
        loadComponent: () => import('./pages/amiibos/amiibos.page').then(m => m.AmiibosPage),
        data: { type: 'card' }
      },
      {
        path: '**',
        redirectTo: 'figures'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'amiibos'
  }
];
