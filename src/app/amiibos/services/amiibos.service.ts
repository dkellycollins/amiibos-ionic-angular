import { Injectable } from '@angular/core';
import { AmiiboModel } from './AmiiboModel';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class AmiibosService {

  constructor(private readonly database: AngularFirestore) { }

  /**
   * Gets the list of Amiibos Series available.
   *
   * @returns The series available.
   */
  public getAmiiboSeries(): Observable<Array<string>> {
    return this.getCollection()
      .valueChanges()
      .pipe(
        map(amiibos => amiibos
          .map(amiibo => amiibo.series)
          .filter((series: string | null): series is string => !!series)
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort()
        ),
        tap(() => console.log('Amiibos Series'))
      );
  }

  /**
   * Gets all of the available amiibos.
   *
   * @returns All available amiibos.
   */
  public getAmiibos(): Observable<Array<AmiiboModel>> {
    return this.getCollection().valueChanges().pipe(tap(() => console.log('Amiibos')));
  }

  /**
   * Gets the collection of Amiibos that belong to the specified series.
   *
   * @param series - The name of the series to filter by.
   * @returns The Amiibos that belong to specified series.
   */
  public getAmiibosBySeries(series: string): Observable<Array<AmiiboModel>> {
    const query: QueryFn = ref => ref.where('series', '==', series);
    return this.getCollection(query).valueChanges().pipe(tap(() => console.log(`Amiibos By ${series}`)));
  }

  /**
   * Finds the Amiibo with the provided slug.
   *
   * @param slug The unique identifier of the Amiibo.
   * @returns The matching Amiibo.
   */
  public getAmiiboBySlug(slug: string): Observable<AmiiboModel> {
    return this.getCollection().doc<AmiiboModel>(slug).valueChanges().pipe(tap(() => console.log(`Amiibo ${slug}`)));
  }

  private getCollection(query?: QueryFn): AngularFirestoreCollection<AmiiboModel> {
    return this.database.collection<AmiiboModel>('amiibos', query);
  }
}