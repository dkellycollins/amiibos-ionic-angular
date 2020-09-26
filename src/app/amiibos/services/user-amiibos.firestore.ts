import { Injectable } from '@angular/core';
import { QueryFn } from '@angular/fire/firestore';
import { NgxsFirestore } from '@ngxs-labs/firestore-plugin';
import { Observable } from 'rxjs';
import { UserAmiiboModel } from '../models/user-amiibo.model';

@Injectable()
export class UserAmiibosFirestore extends NgxsFirestore<UserAmiiboModel> {
  protected path = 'user-amiibos';

  public collectionByUser$(userUid: string): Observable<Array<UserAmiiboModel>> {
    const query: QueryFn = ref => ref.where('userUid', '==', userUid);
    return this.collection$(query);
  }

  public docById$(amiiboSlug: string, userUid: string): Observable<UserAmiiboModel> {
    return this.doc$(`${amiiboSlug}:${userUid}`);
  }
}
