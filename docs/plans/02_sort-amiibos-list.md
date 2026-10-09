# Sort the amiibos list

## Goal

Add a control to the amiibos list page that sorts the list by one of:

- Name
- Series
- Release date

with an ascending/descending toggle. Default: Name, ascending.

## Current state

- `AmiibosPage` (`src/app/pages/amiibos`) has a toolbar with a single "funnel" button that opens `SelectSeriesModalComponent`. The chosen series is written to the `series` query param, and a route subscription pushes `{ type, series }` into the store via `AmiibosActions.SetFilters`.
- `AmiibosSelectors.selectedAmiibos` filters `allAmiibos` by type/series; `collectedAmiibos` maps that list and adds `isCollected`. Neither sorts, so the list shows whatever order Firestore returns.
- `selectSeries()` navigates with `queryParams: { series }`, which replaces **all** query params.
- `releaseDate` is a `string` whose format isn't guaranteed (the details page already parses it defensively with `new Date(...)` and falls back to the raw value).

## Design

### 1. Sort model

New file `src/app/amiibos/models/amiibo-sort.model.ts`:

```ts
export type AmiiboSortField = 'name' | 'series' | 'releaseDate';
export type AmiiboSortDirection = 'asc' | 'desc';

export interface AmiiboSortModel {
  field: AmiiboSortField;
  direction: AmiiboSortDirection;
}

export const DEFAULT_AMIIBO_SORT: AmiiboSortModel = { field: 'name', direction: 'asc' };
```

Plus a list of `{ field, label }` options used by the UI, and type guards for validating query params.

### 2. Sort order rules

| Field        | Ascending                         | Descending                        |
|--------------|-----------------------------------|-----------------------------------|
| Name         | A → Z                             | Z → A                             |
| Series       | A → Z                             | Z → A                             |
| Release date | Oldest → newest                   | Newest → oldest                   |

- Text comparisons are case-insensitive (`localeCompare` with `sensitivity: 'base'`).
- Ties on series or release date are broken by name, always A → Z, so the order within a group stays readable whichever direction is chosen.
- Amiibos with a missing series or a missing/unparseable release date always go last, in either direction.

The comparison logic lives in a pure module `src/app/amiibos/state/amiibo-sort.ts` with a `sortAmiibos(amiibos, sort)` entry point. It returns a new array and never sorts the store's array in place.

### 3. State

- `AmiibosStateModel.filters` gains `sort: AmiiboSortModel`, default `DEFAULT_AMIIBO_SORT`.
- `AmiibosActions.SetFilters` payload type becomes `{ type?: string, series?: string, sort?: AmiiboSortModel }`. The existing handler already merges partial filters.
- New selector `AmiibosSelectors.selectedSort`.
- `selectedAmiibos` takes `selectedSort` as an extra input and returns `sortAmiibos(filtered, selectedSort)`. `collectedAmiibos` and `progress` build on it, so the list picks up the sort automatically and progress counts are unaffected.
- `AmiibosService` gets `selectedSort$`; `setFilters` signature widens to match the action.

### 4. URL

Store the sort in `sort` (`name` | `series` | `releaseDate`) and `order` (`asc` | `desc`) query params, the same way series is stored, so it survives refresh/back navigation and can be linked.

- The route subscription in `AmiibosPage.ngOnInit` reads both, validates them (unknown or missing values fall back to the defaults), and includes the result in `setFilters`.
- **Fix needed alongside:** `selectSeries()` currently replaces all query params, which would wipe out the sort. All toolbar navigation uses `queryParamsHandling: 'merge'`.

### 5. Controls

Two new buttons in the toolbar's end slot, after the existing funnel button:

1. **Sort by** (`swap-vertical` icon, `aria-label="Sort by"`). Opens an Ionic action sheet titled "Sort by" with Name / Series / Release date plus Cancel; the active field shows a checkmark. Choosing a field keeps the current direction.
2. **Direction** (`arrow-up` when ascending, `arrow-down` when descending; `aria-label` "Sort ascending"/"Sort descending"). One tap flips the direction — no menu.

The action sheet lives in a small injectable `SelectSortActionSheetService` (`src/app/amiibos/components/select-sort-action-sheet/select-sort-action-sheet.service.ts`) wrapping `ActionSheetController`, following the existing `SelectSeriesModalService` pattern:

```ts
public async open(currentField: AmiiboSortField): Promise<AmiiboSortField | undefined>
```

It returns `undefined` on cancel/backdrop dismiss. Provided in `AmiibosModule`.

`AmiibosPage` gets `selectSortField()` and `toggleSortDirection()`, each navigating with the new query params merged in.

### 6. Tests

- `amiibo-sort.spec.ts`: each field in both directions, tie-breaking by name, missing series / unparseable dates going last in both directions, and that the input array isn't mutated.
- Spec for `SelectSortActionSheetService`: returns the selected field; returns `undefined` on cancel.

## Out of scope

- Sorting on the details page or anywhere other than the list
- Persisting the sort choice across sessions (beyond the URL)
