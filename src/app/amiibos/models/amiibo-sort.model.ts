/**
 * The Amiibo property the list is sorted by.
 */
export type AmiiboSortField = 'name' | 'series' | 'releaseDate';

/**
 * Whether the list is sorted ascending (A → Z, oldest → newest) or descending.
 */
export type AmiiboSortDirection = 'asc' | 'desc';

export interface AmiiboSortModel {
  field: AmiiboSortField;
  direction: AmiiboSortDirection;
}

export const DEFAULT_AMIIBO_SORT: AmiiboSortModel = {
  field: 'name',
  direction: 'asc'
};

/**
 * Sort fields in the order they are offered to the user, with their display labels.
 */
export const AMIIBO_SORT_FIELD_OPTIONS: Array<{ field: AmiiboSortField, label: string }> = [
  { field: 'name', label: 'Name' },
  { field: 'series', label: 'Series' },
  { field: 'releaseDate', label: 'Release date' }
];

// ---------------------------------------------------------------------------
// Type guards, used to validate untrusted values such as query params
// ---------------------------------------------------------------------------

export function isAmiiboSortField(value: unknown): value is AmiiboSortField {
  return AMIIBO_SORT_FIELD_OPTIONS.some(option => {
    return option.field === value;
  });
}

export function isAmiiboSortDirection(value: unknown): value is AmiiboSortDirection {
  return value === 'asc' || value === 'desc';
}
