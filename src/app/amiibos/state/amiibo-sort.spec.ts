import { AmiiboModel } from '../models/amiibo.model';
import { sortAmiibos } from './amiibo-sort';

function createAmiibo(name: string, series: string, releaseDate: string): AmiiboModel {
  return {
    slug: name.toLowerCase(),
    type: 'figure',
    name,
    description: '',
    series,
    figureUrl: '',
    releaseDate
  };
}

function getNames(amiibos: Array<AmiiboModel>): Array<string> {
  return amiibos.map(amiibo => {
    return amiibo.name;
  });
}

describe('sortAmiibos', () => {
  const mario = createAmiibo('Mario', 'Super Mario', '2014-11-21');
  const link = createAmiibo('Link', 'Zelda', '2014-11-21');
  const bowser = createAmiibo('bowser', 'Super Mario', '2015-01-01');
  const kirby = createAmiibo('Kirby', null, 'not a date');

  const amiibos = [mario, link, bowser, kirby];

  describe('by name', () => {
    it('sorts A to Z, ignoring case, when ascending', () => {
      const sorted = sortAmiibos(amiibos, { field: 'name', direction: 'asc' });
      expect(getNames(sorted)).toEqual(['bowser', 'Kirby', 'Link', 'Mario']);
    });

    it('sorts Z to A when descending', () => {
      const sorted = sortAmiibos(amiibos, { field: 'name', direction: 'desc' });
      expect(getNames(sorted)).toEqual(['Mario', 'Link', 'Kirby', 'bowser']);
    });
  });

  describe('by series', () => {
    it('sorts series A to Z, names A to Z within a series, missing series last', () => {
      const sorted = sortAmiibos(amiibos, { field: 'series', direction: 'asc' });
      expect(getNames(sorted)).toEqual(['bowser', 'Mario', 'Link', 'Kirby']);
    });

    it('sorts series Z to A, keeps names A to Z within a series, missing series last', () => {
      const sorted = sortAmiibos(amiibos, { field: 'series', direction: 'desc' });
      expect(getNames(sorted)).toEqual(['Link', 'bowser', 'Mario', 'Kirby']);
    });
  });

  describe('by release date', () => {
    it('sorts oldest first, ties by name, unparseable dates last', () => {
      const sorted = sortAmiibos(amiibos, { field: 'releaseDate', direction: 'asc' });
      expect(getNames(sorted)).toEqual(['Link', 'Mario', 'bowser', 'Kirby']);
    });

    it('sorts newest first, ties by name, unparseable dates last', () => {
      const sorted = sortAmiibos(amiibos, { field: 'releaseDate', direction: 'desc' });
      expect(getNames(sorted)).toEqual(['bowser', 'Link', 'Mario', 'Kirby']);
    });
  });

  it('does not modify the input array', () => {
    const original = [...amiibos];
    sortAmiibos(amiibos, { field: 'name', direction: 'desc' });
    expect(amiibos).toEqual(original);
  });
});
