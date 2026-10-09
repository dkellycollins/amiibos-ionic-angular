# Amiibo details page

## Goal

Tapping an amiibo in the list navigates to a details view for that amiibo. The view shows:

- The figure image, centered and full width at the top
- Series
- Release date
- Description
- The same "collected" toggle used in the list, which adds/removes the amiibo from the user's collection

## Current state

- `AmiiboItemComponent` (`src/app/amiibos/components/amiibo-item`) renders an `ion-item button="true"` with a thumbnail, name, series, and an `ion-toggle` bound to a `FormControl`. It emits `collectedChanged`. Nothing happens when the item itself is tapped.
- `AmiibosListComponent` renders the items and re-emits `collectedChanged` with the slug. It contains a commented-out `onItemClick` / `selectedAmiibo` experiment.
- `AmiibosPage` (`src/app/pages/amiibos`) wires the list to `AmiibosService`, which wraps the NGXS store.
- Routes: `amiibos/figures`, `amiibos/cards`, with `**` redirecting to `amiibos`.
- Selectors only expose amiibos filtered by the current type/series (`selectedAmiibos`, `collectedAmiibos`). There is no "get one amiibo by slug" selector.

## Design

### 1. Routing

Add a new lazy-loaded page module, registered in `app-routing.module.ts` **before** the `**` redirect:

```ts
{ path: 'amiibo/:slug', loadChildren: () => import('./pages/amiibo-details/amiibo-details.module').then(m => m.AmiiboDetailsPageModule) },
```

Keeping it outside the `amiibos/...` child routes avoids clashing with that module's own `**` redirect, and means the details page doesn't depend on the current type/series filter (so a deep link like `/amiibo/mario` works).

### 2. State: select a single amiibo by slug

Add a parameterised selector to `AmiibosSelectors` built with `createSelector`, using `allAmiibos` and `userAmiibos` (not the filtered list, so it works regardless of filters or deep links):

```ts
public static collectableAmiiboBySlug(slug: string) {
  return createSelector(
    [AmiibosSelectors.allAmiibos, AmiibosSelectors.userAmiibos],
    (amiibos, userAmiibos): CollectableAmiiboModel | undefined => { ... }
  );
}
```

Expose it on `AmiibosService` as `collectableAmiiboBySlug$(slug: string): Observable<CollectableAmiiboModel | undefined>`.

### 3. Shared collected toggle

To reuse the exact toggle from the list, extract it into a small component in `src/app/amiibos/components/amiibo-collected-toggle/`:

- `@Input() collected: boolean` (sets the `FormControl` without emitting, same as today)
- `@Output() collectedChanged: EventEmitter<boolean>`
- Template: the existing `<ion-toggle [formControl]="control">`
- Stops click propagation so toggling inside a tappable list item doesn't also trigger navigation.

`AmiiboItemComponent` then uses `<app-amiibo-collected-toggle slot="end" ...>` instead of its inline toggle/`FormControl`. This also removes the broken `collected` getter in `AmiiboItemComponent` (`this.control.value()` — `value` is not a function).

Declare and export the new component in `AmiibosModule`.

### 4. List → navigation

- `AmiiboItemComponent`: add `@Output() selected: EventEmitter<void>` fired on item `(click)`.
- `AmiibosListComponent`: add `@Output() amiiboSelected: EventEmitter<string>` (the slug), and delete the commented-out `onItemClick` / `selectedAmiibo` block it replaces.
- `AmiibosPage`: handle `(amiiboSelected)` by calling `router.navigate(['/amiibo', slug])`.

Keeping navigation in the page (rather than a `routerLink` in the item) matches the existing pattern where presentational components emit events and the page acts on them.

### 5. Details page

New `src/app/pages/amiibo-details/`:

- `amiibo-details-routing.module.ts`, `amiibo-details.module.ts` (imports `CommonModule`, `IonicModule`, `AmiibosModule`, routing)
- `amiibo-details.page.ts`:
  - Reads `slug` from `ActivatedRoute.paramMap`, switches into `amiibosService.collectableAmiiboBySlug$(slug)`.
  - Calls `amiibosService.loadAmiibos()` so a deep link / page refresh still loads data (user amiibos are already loaded via `AuthActions.SetUser`).
  - `toggleAmiibo(collected)` → `amiibosService.toggleAmiibo(slug, collected)`.
- `amiibo-details.page.html`:
  - Header: `ion-back-button` with `defaultHref="/amiibos"`, title = amiibo name, and the collected toggle in the toolbar's end slot.
  - Content:
    - `ion-img` with full width, centered (`display: block; width: 100%; object-fit: contain; max-height` capped so tall figures don't push everything off-screen)
    - `ion-list` with items: Series, Release date
    - Description rendered with `[innerHTML]` (same as the list item does today, since descriptions contain HTML)
  - Loading state while the amiibo is `undefined`; "Amiibo not found" if amiibos have loaded and the slug doesn't match.
- `amiibo-details.page.scss` for the image styling.

Release date: the stored format isn't visible from the code, so the page parses it defensively. If it parses as a date it's formatted as a long date; otherwise it's displayed as-is.

### 6. Tests

- Spec for the new toggle component (create + emits on change, does not emit when input is set).
- Update `AmiiboItemComponent` spec if needed after the extraction.
- Basic "should create" spec for the details page, matching the existing spec style.

## Out of scope

- Editing amiibo data
- Previous/next navigation between amiibos on the details page
