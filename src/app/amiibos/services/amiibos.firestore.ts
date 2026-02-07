import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AmiiboModel } from '../models/amiibo.model';

@Injectable()
export class AmiibosFirestore {
  private readonly collectionName = 'amiibos';

  constructor(private readonly firestore: Firestore) {}

  public collection$(): Observable<Array<AmiiboModel>> {
    const ref = collection(this.firestore, this.collectionName);
    return collectionData(ref, { idField: 'id' }) as Observable<Array<AmiiboModel>>;
  }

  public collectionByType$(type: string): Observable<Array<AmiiboModel>> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, where('type', '==', type));
    return collectionData(q, { idField: 'id' }) as Observable<Array<AmiiboModel>>;
  }
}
