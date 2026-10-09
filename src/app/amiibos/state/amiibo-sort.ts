import { AmiiboSortDirection, AmiiboSortModel } from '../models/amiibo-sort.model';
import { AmiiboModel } from '../models/amiibo.model';

/**
 * Returns a new array of Amiibos sorted by the given field and direction.
 *
 * - Ties on series or release date are broken by name, always A → Z.
 * - Amiibos with a missing series or a missing/unparseable release date
 *   always go last, whichever direction is chosen.
 * - The input array is never modified.
 */
export function sortAmiibos<T extends AmiiboModel>(amiibos: Array<T>, sort: AmiiboSortModel): Array<T> {
  const sortedAmiibos = [...amiibos];

  if (sort.field === 'series') {
    sortedAmiibos.sort((first, second) => {
      return compareBySeries(first, second, sort.direction);
    });
    return sortedAmiibos;
  }

  if (sort.field === 'releaseDate') {
    sortedAmiibos.sort((first, second) => {
      return compareByReleaseDate(first, second, sort.direction);
    });
    return sortedAmiibos;
  }

  sortedAmiibos.sort((first, second) => {
    return applyDirection(compareText(first.name, second.name), sort.direction);
  });
  return sortedAmiibos;
}

// ---------------------------------------------------------------------------
// Field comparisons
// ---------------------------------------------------------------------------

function compareBySeries(first: AmiiboModel, second: AmiiboModel, direction: AmiiboSortDirection): number {
  const missingComparison = compareMissing(!first.series, !second.series);
  if (missingComparison !== 0) {
    return missingComparison;
  }

  const seriesComparison = compareText(first.series || '', second.series || '');
  if (seriesComparison !== 0) {
    return applyDirection(seriesComparison, direction);
  }

  return compareText(first.name, second.name);
}

function compareByReleaseDate(first: AmiiboModel, second: AmiiboModel, direction: AmiiboSortDirection): number {
  const firstTime = parseReleaseDate(first.releaseDate);
  const secondTime = parseReleaseDate(second.releaseDate);

  const missingComparison = compareMissing(firstTime === undefined, secondTime === undefined);
  if (missingComparison !== 0) {
    return missingComparison;
  }

  if (firstTime !== undefined && secondTime !== undefined && firstTime !== secondTime) {
    return applyDirection(firstTime - secondTime, direction);
  }

  return compareText(first.name, second.name);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Orders missing values after present ones. Returns 0 when both or neither are missing.
 */
function compareMissing(isFirstMissing: boolean, isSecondMissing: boolean): number {
  if (isFirstMissing === isSecondMissing) {
    return 0;
  }

  if (isFirstMissing) {
    return 1;
  }

  return -1;
}

function compareText(first: string, second: string): number {
  return (first || '').localeCompare(second || '', undefined, { sensitivity: 'base' });
}

function applyDirection(comparison: number, direction: AmiiboSortDirection): number {
  if (direction === 'desc') {
    return -comparison;
  }

  return comparison;
}

/**
 * Returns the release date as a timestamp, or undefined when it is missing or cannot be parsed.
 */
function parseReleaseDate(releaseDate: string | undefined): number | undefined {
  if (!releaseDate) {
    return undefined;
  }

  const time = new Date(releaseDate).getTime();
  if (isNaN(time)) {
    return undefined;
  }

  return time;
}
