import { Injectable } from '@angular/core';
import { NgxsFirestore } from '@ngxs-labs/firestore-plugin';
import { AmiiboModel } from '../models/amiibo.model';

@Injectable()
export class AmiibosFirestore extends NgxsFirestore<AmiiboModel> {
  protected path = 'amiibos';
}
