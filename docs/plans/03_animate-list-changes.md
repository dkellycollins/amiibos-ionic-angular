# Animate list changes

## Goal

When the amiibos list changes because of a **sort** (field or direction) or a **filter** (series selected / cleared), animate the transition instead of snapping:

- Items that stay in the list **slide** from their old position to their new one.
- Items that appear **fade in while sliding in from the left**, slightly staggered.
- Items that are removed **fade out while sliding out to the left**.

## Current state

- `AmiibosListComponent` renders `<app-amiibo-item *ngFor="let amiibo of amiibos; trackBy: getAmiiboId">` inside an `ion-list`. Because of `trackBy`, Angular reuses and **moves** the existing DOM element when the order changes, so each item keeps its identity across sorts/filters — exactly what a move animation needs.
- Sort and series changes both arrive as a new `amiibos` array on the same component instance (query param changes don't recreate the page). Switching type (figures ↔ cards) is a different route and recreates the page.
- Toggling "collected" also produces a new `amiibos` array, but with the same order.
- `@angular/animations` is **not** installed. `@ionic/angular` provides `AnimationController` (a wrapper over the Web Animations API), which the app already depends on.
- `app-amiibo-item` has no host styles, so its host element is `display: inline`, and transforms don't apply to inline elements.

## Approach: FLIP with Ionic's `AnimationController`

Angular's `ngFor` can't animate reordering by itself, and `@angular/animations` only handles enter/leave, not moves. The standard technique for moves is **FLIP** (First, Last, Invert, Play):

1. **First:** just before the list re-renders, record each item's on-screen position, keyed by slug.
2. **Last:** after Angular has updated the DOM, read each item's new position.
3. **Invert:** for each item that moved, apply a `translateY(oldTop - newTop)` so it *looks* like it hasn't moved.
4. **Play:** animate that transform back to `none`.

Items with no "first" position are new, and get the fade-in instead.

### 1. Directive: `appAnimateListChanges`

New directive `src/app/core/directives/animate-list-changes.directive.ts`, declared/exported by `CoreModule`. It's generic and knows nothing about amiibos, so it could be reused for other lists.

```html
<ion-list [appAnimateListChanges]="amiibos">
  <app-amiibo-item
    *ngFor="let amiibo of amiibos; trackBy: getAmiiboId"
    [attr.data-animate-key]="amiibo.slug"
    ...
```

- The input is the list data. Changes to it are the trigger.
- Children are identified by their `data-animate-key` attribute.
- `ngOnChanges`: snapshot the `top` of every keyed child (the **First** step). Because this runs before Angular updates the `ngFor`, it records the old layout.
- `ngAfterViewChecked`: if a snapshot is pending, run **Last / Invert / Play** and clear the snapshot.

New children that contain Ionic (Stencil) components have no height until those components render, which happens just after Angular inserts them. So the directive waits for `componentOnReady()` on web components inside new children before measuring. This still finishes before the browser paints. If another change arrives while waiting, the older one is dropped. Waiting and animating run outside Angular's zone, to avoid extra change detection.

Measurement uses `getBoundingClientRect()`, which includes in-flight transforms. So if the user changes the sort again mid-animation, items start from where they visually are. Running animations are stopped before new ones start.

### 2. What gets animated

| Item                            | Animation                                                                  |
|---------------------------------|----------------------------------------------------------------------------|
| Stayed, position changed        | Slide: `translateY(delta)` → `none`, 250 ms, ease-out                      |
| Stayed, moved into view from far off-screen | Fade in (as for new items); a long slide would just be a blur |
| Stayed, same position           | Nothing (this covers the collected toggle, so it doesn't animate)          |
| New                             | Fade in from the left: opacity 0 → 1 and `translateX(-32px)` → `none`, 200 ms, staggered by 15 ms (stagger capped at ~150 ms total) |
| Removed                         | Fade out to the left: opacity 1 → 0 and `none` → `translateX(-32px)`, 200 ms, not staggered (see "Removed items" below) |

### 3. Performance guards

The list can hold ~250+ items, and most are off-screen.

- Only animate items whose old **or** new position is within the scroll viewport (plus one screen of margin). Everything else snaps into place, which is invisible to the user anyway.
- Skip animation entirely when the previous list was empty (initial load / data arriving), so the first render isn't a wall of animations.
- Use only `transform` and `opacity`, which the browser can animate without re-layout.

### 4. Accessibility

If the user has `prefers-reduced-motion: reduce` set, skip all animations and render changes instantly.

### 5. Supporting change

Add `:host { display: block; }` to `amiibo-item.component.scss` so the host element can be transformed. This has no visual effect otherwise; the inner `ion-item` is already block-level.

## Removed items

By the time `ngAfterViewChecked` runs, `ngFor` has already taken removed items out of the DOM. They aren't garbage yet, though: the directive keeps references to them.

1. **`ngOnChanges`** (before the update): along with each child's position, keep a reference to its element, keyed by `data-animate-key`. Also record the host's own `top`.
2. **`ngAfterViewChecked`** (after the update, synchronously, before the browser paints): any recorded key that no longer has a child in the host was removed. For each removed element whose old position was near the viewport, re-insert it into the host as a **ghost**:
   - `position: absolute; left: 0; right: 0; top: <old top relative to the host>`, so it sits exactly where it was without taking up space in the layout. The remaining items then slide into its place underneath it.
   - `pointer-events: none`, so it can't be tapped while it fades.
   - Its `data-animate-key` is removed, so the directive never measures it or treats it as a list item again.
3. The ghost plays the fade-out-to-the-left animation and is removed from the DOM when it finishes.

Supporting details:

- The host gets `position: relative` (only if it's currently `static`) so the ghosts' `top` is relative to it.
- Ghosts are appended after Angular's own nodes. Angular never sees them, so they can't interfere with `ngFor`.
- Ghosts are inserted synchronously in `ngAfterViewChecked`, not after waiting for new children to render, so a removed row is never missing for a frame.
- If the list changes again mid-animation, or the directive is destroyed, all ghosts are removed immediately.
- The re-inserted element is the real one with its rendered Ionic content, not a clone, so it looks identical (including the collected toggle state). Its Angular bindings are already destroyed, which is fine for something that is only fading away.

### Ordering in `ngAfterViewChecked`

To keep this correct when changes overlap:

1. Stop running animations and remove existing ghosts. The "before" positions were already measured with those animations applied.
2. Insert ghosts for this change's removed items and start their fade-out.
3. Wait for web components in new children to render.
4. If no newer change arrived, measure and play the move / enter animations.

## Fixes found during implementation

- **`trackBy` was broken.** `AmiibosListComponent.getAmiiboId(amiibo)` took one argument, but Angular calls `trackBy(index, item)`. So it returned `index.slug` (always `undefined`), and `ngFor` matched rows by position: when the list changed, it reused existing elements for different amiibos instead of moving or removing them. Fixed by changing the signature to `getAmiiboId(index, amiibo)`. Without this, removed rows are never detached, so no ghosts appear, and "moves" are really content swaps.
- **Read before write.** `animateRemainingChildren` measures every child before starting any animation, so starting animations doesn't force a layout recalculation per row.
- **Spec independent of the runner window.** A hidden Karma tab reports `innerHeight: 0`, which made every test item count as off-screen. The spec stubs `window.innerHeight` and pins the test list to the top of the viewport.

## Test setup fix

Move `import 'zone.js/dist/zone-testing';` to the top of `src/test.ts`, before `@angular/core/testing`, so specs can run again.

## Tests

- Directive spec with a small host component rendering keyed `div`s:
  - Reordering the input starts slide animations only for items whose position changed.
  - Adding an item starts a fade-in for that item only.
  - Removing an item re-inserts it as a ghost (no `data-animate-key`, absolutely positioned) with a fade-out, and the ghost is removed once the animation finishes.
  - A second change mid-animation removes the first change's ghosts.
  - No animations when the previous list was empty.
  - No animations when `prefers-reduced-motion` is set (stub `matchMedia`).
  - Uses a stubbed `AnimationController` so the test checks what was requested rather than relying on real timing.

## Out of scope

- Animating the switch between figures and cards (different route, page is recreated)
- Animating the progress bar count
