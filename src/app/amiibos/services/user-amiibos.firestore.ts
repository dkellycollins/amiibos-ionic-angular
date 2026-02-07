import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, query, setDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserAmiiboModel } from '../models/user-amiibo.model';

@Injectable()
export class UserAmiibosFirestore {
  private readonly collectionName = 'user-amiibos';

  constructor(private readonly firestore: Firestore) {}

  public collection$(): Observable<Array<UserAmiiboModel>> {
    const ref = collection(this.firestore, this.collectionName);
    return collectionData(ref, { idField: 'id' }) as Observable<Array<UserAmiiboModel>>;
  }

  public collectionByUser$(userUid: string): Observable<Array<UserAmiiboModel>> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, where('userUid', '==', userUid));
    return collectionData(q, { idField: 'id' }) as Observable<Array<UserAmiiboModel>>;
  }

  public docById$(amiiboSlug: string, userUid: string): Observable<UserAmiiboModel | undefined> {
    const docRef = doc(this.firestore, this.collectionName, `${amiiboSlug}:${userUid}`);
    return docData(docRef, { idField: 'id' }) as Observable<UserAmiiboModel | undefined>;
  }

  public async update(docId: string, data: Partial<UserAmiiboModel>): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, docId);
    await setDoc(docRef, data, { merge: true });
  }

  public async create(docId: string, data: UserAmiiboModel): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, docId);
    await setDoc(docRef, data);
  }
}
