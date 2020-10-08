import { Injectable } from '@angular/core';
import { QueryFn } from '@angular/fire/firestore';
import { NgxsFirestore } from '@ngxs-labs/firestore-plugin';
import { Observable } from 'rxjs';
import { AmiiboModel } from '../models/amiibo.model';

@Injectable()
export class AmiibosFirestore extends NgxsFirestore<AmiiboModel> {
  protected path = 'amiibos';

  public collectionByType$(type: string): Observable<Array<AmiiboModel>> {
    const query: QueryFn = ref => ref.where('type', '==', type);
    return this.collection$(query);
  }
}
