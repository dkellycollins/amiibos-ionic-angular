import { Injectable } from '@angular/core';
import { NgxsFirestore } from '@ngxs-labs/firestore-plugin';
import { AmiiboModel } from './AmiiboModel';

@Injectable()
export class AmiibosFirestore extends NgxsFirestore<AmiiboModel> {
  protected path = 'amiibos';
}