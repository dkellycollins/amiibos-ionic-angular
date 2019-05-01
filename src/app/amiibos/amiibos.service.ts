import { Injectable } from '@angular/core';
import * as amiibosData from '../../assets/lineup.model.json';

export interface AmiiboModel {
  /**
   * Unique identifier of the Amiibo.
   */
  slug: string;

  /**
   * Display name for the Amiibo figure.
   */
  name: string;

  /**
   * Additional information about the Amiibo figure.
   */
  description: string;

  /**
   * The name of the series the Amiibo belongs too.
   */
  series: string;
  
  /**
   * The full url to the image for the Amiibo figure.
   */
  figureUrl: string;

  /**
   * The date when the Amiibo figure was released.
   */
  releaseDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AmiibosService {

  public getAmiiboBySlug(slug: string): AmiiboModel {
    return this.loadAmiibos()
      .find(amiibo => amiibo.slug === slug);
  }

  public getAmiibos(): Array<AmiiboModel> {
    return this.loadAmiibos();
  }

  public getAmiiboSeries(): Array<string> {
    return this.loadAmiibos()
      .map(amiibo => amiibo.series)
      .filter(value => !!value)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }

  public getAmiibosBySeries(series: string): Array<AmiiboModel> {
    return this.loadAmiibos()
      .filter(amiibo => amiibo.series === series);
  }

  private loadAmiibos(): Array<AmiiboModel> {
    const { amiiboList } = amiibosData;
    return amiiboList
      .filter(amiibo => amiibo.type === 'Figure')
      .map(amiibo => ({
        slug: amiibo.slug,
        name: amiibo.amiiboName
          .replace('&#8482;', '')
          .replace('&#174;', ''),
        description: amiibo.overviewDescription,
        series: amiibo.series,
        figureUrl: `https://www.nintendo.com/${amiibo.figureURL}`,
        releaseDate: amiibo.releaseDateMask
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
