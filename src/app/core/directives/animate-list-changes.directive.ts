import { AfterViewChecked, Directive, ElementRef, Input, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Animation, AnimationController } from '@ionic/angular';

// ---------------------------------------------------------------------------
// Timing
// ---------------------------------------------------------------------------

const MOVE_DURATION_MS = 250;
const ENTER_DURATION_MS = 200;
const LEAVE_DURATION_MS = 200;
const ENTER_STAGGER_MS = 15;
const MAX_ENTER_DELAY_MS = 150;

/**
 * How far children slide horizontally as they enter (from the left) and leave (to the left).
 */
const SLIDE_OFFSET_PX = 32;

/**
 * Attribute that identifies each child across list changes. Use a stable value such as an id.
 */
const KEY_ATTRIBUTE = 'data-animate-key';

/**
 * A Stencil web component, such as an Ionic element. These render asynchronously after being
 * added to the DOM, and have no size until `componentOnReady()` resolves.
 */
interface WebComponentElement extends Element {
  componentOnReady(): Promise<unknown>;
}

/**
 * The layout recorded just before Angular applies a change to the list.
 */
interface LayoutSnapshot {
  hostTop: number;
  hostHeight: number;
  children: Map<string, { element: HTMLElement, top: number }>;
}

/**
 * Animates the keyed children of an element when the bound list changes:
 * - Children that stay but change position slide from their old position to their new one.
 * - Children that are new fade in while sliding in from the left.
 * - Children that are removed fade out while sliding out to the left.
 *
 * Usage:
 *   <ion-list [appAnimateListChanges]="items">
 *     <app-item *ngFor="let item of items; trackBy: getId" [attr.data-animate-key]="item.id">
 *
 * The `ngFor` must use `trackBy`, so children keep their DOM elements when they move.
 * Children must be block-level elements, because transforms don't apply to inline elements.
 *
 * Moves use the FLIP technique: record positions before Angular updates the DOM (First),
 * read them again after (Last), offset each child back to where it was (Invert),
 * then animate the offset away (Play).
 *
 * New children that contain Ionic (Stencil) components are only measured after those components
 * have rendered, because until then they have no height and every position would be wrong.
 *
 * Removed children have already been taken out of the DOM by `ngFor` when this directive runs.
 * The directive keeps a reference to them beforehand, then puts them back as "ghosts":
 * absolutely positioned where they were, so they don't affect layout, and deleted once faded out.
 */
@Directive({
  selector: '[appAnimateListChanges]'
})
export class AnimateListChangesDirective implements OnChanges, AfterViewChecked, OnDestroy {

  /**
   * The list being rendered. Each change to it triggers the animation.
   */
  @Input('appAnimateListChanges')
  public items?: ReadonlyArray<unknown>;

  /**
   * The layout before the pending change. Undefined when there is no change waiting to be animated.
   */
  private layoutBeforeChange?: LayoutSnapshot;

  private runningAnimations: Array<Animation> = [];

  /**
   * Removed children that have been put back temporarily so they can fade out.
   */
  private ghostElements: Array<HTMLElement> = [];

  /**
   * Incremented for every change, so a change that is still waiting for children to render
   * can tell it has been superseded by a newer one.
   */
  private latestChangeId = 0;

  constructor(
    private readonly hostElement: ElementRef<HTMLElement>,
    private readonly animationController: AnimationController,
    private readonly ngZone: NgZone
  ) { }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public ngOnChanges(changes: SimpleChanges): void {
    const itemsChange = changes.items;
    if (!itemsChange || itemsChange.firstChange) {
      return;
    }

    // Skip the initial load, so data arriving doesn't animate every row at once.
    const previousItems: ReadonlyArray<unknown> | undefined = itemsChange.previousValue;
    if (!previousItems || previousItems.length === 0) {
      return;
    }

    if (this.prefersReducedMotion()) {
      return;
    }

    // First: runs before Angular updates the DOM, so this is the old layout.
    this.layoutBeforeChange = this.measureLayout();
  }

  public ngAfterViewChecked(): void {
    if (!this.layoutBeforeChange) {
      return;
    }

    const layoutBeforeChange = this.layoutBeforeChange;
    this.layoutBeforeChange = undefined;

    this.latestChangeId++;
    const changeId = this.latestChangeId;

    // Outside Angular, so waiting and animating doesn't trigger extra change detection cycles.
    this.ngZone.runOutsideAngular(async () => {
      // Stop in-flight animations so later measurements are the children's real layout positions.
      // The "before" layout was measured with those animations still applied, so moves start
      // from wherever each child visually was.
      this.stopRunningAnimations();

      // Synchronously, before the browser paints, so a removed child is never missing for a frame.
      this.animateRemovedChildren(layoutBeforeChange);

      await this.waitForNewChildrenToRender(layoutBeforeChange);

      const isSuperseded = changeId !== this.latestChangeId;
      if (isSuperseded) {
        return;
      }

      this.animateRemainingChildren(layoutBeforeChange);
    });
  }

  public ngOnDestroy(): void {
    // Cancels any change still waiting for its children to render.
    this.latestChangeId++;
    this.stopRunningAnimations();
  }

  // ---------------------------------------------------------------------------
  // Removed children
  // ---------------------------------------------------------------------------

  private animateRemovedChildren(layoutBeforeChange: LayoutSnapshot): void {
    const host = this.hostElement.nativeElement;

    for (const { element, top } of layoutBeforeChange.children.values()) {
      const isStillInList = host.contains(element);
      if (isStillInList) {
        continue;
      }

      if (!this.isNearViewport(top)) {
        continue;
      }

      this.insertGhost(element, top - layoutBeforeChange.hostTop);
      this.playLeave(element);
    }

    if (this.ghostElements.length > 0) {
      this.prepareHostForGhosts(layoutBeforeChange.hostHeight);
    }
  }

  /**
   * Puts a removed child back into the host, at its old position, without affecting layout.
   */
  private insertGhost(element: HTMLElement, topWithinHost: number): void {
    // So the directive never measures it, or mistakes it for a list item, again.
    element.removeAttribute(KEY_ATTRIBUTE);

    element.style.position = 'absolute';
    element.style.top = `${topWithinHost}px`;
    element.style.left = '0';
    element.style.right = '0';
    element.style.pointerEvents = 'none';

    // Appended after Angular's own nodes, which it never looks at, so this can't interfere with ngFor.
    this.hostElement.nativeElement.appendChild(element);
    this.ghostElements.push(element);
  }

  /**
   * Ghosts are positioned relative to the host, and must stay visible when the list gets shorter.
   */
  private prepareHostForGhosts(heightBeforeChange: number): void {
    const host = this.hostElement.nativeElement;

    if (getComputedStyle(host).position === 'static') {
      host.style.position = 'relative';
    }

    // Keep the old height until the ghosts are gone. Otherwise ghosts below the new end of the list
    // would be clipped, and a shorter list would make the scroll position jump mid-animation.
    host.style.minHeight = `${heightBeforeChange}px`;
  }

  private removeGhost(element: HTMLElement): void {
    element.remove();

    this.ghostElements = this.ghostElements.filter(ghost => {
      return ghost !== element;
    });

    if (this.ghostElements.length === 0) {
      this.hostElement.nativeElement.style.minHeight = '';
    }
  }

  private removeAllGhosts(): void {
    for (const ghost of [...this.ghostElements]) {
      this.removeGhost(ghost);
    }
  }

  // ---------------------------------------------------------------------------
  // Remaining and new children
  // ---------------------------------------------------------------------------

  private animateRemainingChildren(layoutBeforeChange: LayoutSnapshot): void {
    // Measure every child before starting any animation. Starting an animation changes styles, so
    // alternating reads and writes would force the browser to recalculate layout once per child,
    // which stalls rendering for around a second on a long list.
    const childrenWithNewTops = this.getKeyedChildren().map(child => {
      return {
        child,
        key: child.getAttribute(KEY_ATTRIBUTE),
        newTop: child.getBoundingClientRect().top
      };
    });

    let enterIndex = 0;

    for (const { child, key, newTop } of childrenWithNewTops) {
      const childBefore = layoutBeforeChange.children.get(key);

      if (!childBefore) {
        if (this.isNearViewport(newTop)) {
          this.playEnter(child, enterIndex);
          enterIndex++;
        }
        continue;
      }

      const offset = childBefore.top - newTop;
      if (offset === 0) {
        continue;
      }

      if (this.isNearViewport(childBefore.top)) {
        this.playMove(child, offset);
        continue;
      }

      // Coming from far off-screen: sliding that distance would just be a blur, so fade in instead.
      if (this.isNearViewport(newTop)) {
        this.playEnter(child, enterIndex);
        enterIndex++;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Animations
  // ---------------------------------------------------------------------------

  private playMove(child: HTMLElement, offset: number): void {
    const animation = this.animationController.create()
      .addElement(child)
      .duration(MOVE_DURATION_MS)
      .easing('ease-out')
      .fill('backwards')
      .fromTo('transform', `translateY(${offset}px)`, 'translateY(0)');

    this.play(animation);
  }

  private playEnter(child: HTMLElement, enterIndex: number): void {
    const delay = Math.min(enterIndex * ENTER_STAGGER_MS, MAX_ENTER_DELAY_MS);

    const animation = this.animationController.create()
      .addElement(child)
      .duration(ENTER_DURATION_MS)
      .delay(delay)
      .easing('ease-out')
      .fill('backwards')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', `translateX(-${SLIDE_OFFSET_PX}px)`, 'translateX(0)');

    this.play(animation);
  }

  private playLeave(ghost: HTMLElement): void {
    const animation = this.animationController.create()
      .addElement(ghost)
      .duration(LEAVE_DURATION_MS)
      .easing('ease-in')
      // Hold the faded-out state until the ghost is removed, so it can't flash back for a frame.
      .fill('forwards')
      .fromTo('opacity', '1', '0')
      .fromTo('transform', 'translateX(0)', `translateX(-${SLIDE_OFFSET_PX}px)`);

    this.play(animation, () => {
      this.removeGhost(ghost);
    });
  }

  private play(animation: Animation, onFinished?: () => void): void {
    this.runningAnimations.push(animation);

    animation.play().then(() => {
      const wasStopped = !this.runningAnimations.includes(animation);
      if (wasStopped) {
        return;
      }

      this.runningAnimations = this.runningAnimations.filter(running => {
        return running !== animation;
      });
      animation.destroy();

      if (onFinished) {
        onFinished();
      }
    });
  }

  private stopRunningAnimations(): void {
    for (const animation of this.runningAnimations) {
      animation.stop();
      animation.destroy();
    }

    this.runningAnimations = [];
    this.removeAllGhosts();
  }

  // ---------------------------------------------------------------------------
  // Measurement
  // ---------------------------------------------------------------------------

  /**
   * Resolves once every web component inside the newly added children has rendered.
   * Ionic renders these within the same frame, so this still finishes before the browser paints.
   */
  private async waitForNewChildrenToRender(layoutBeforeChange: LayoutSnapshot): Promise<void> {
    const renderPromises: Array<Promise<unknown>> = [];

    for (const child of this.getKeyedChildren()) {
      const isNewChild = !layoutBeforeChange.children.has(child.getAttribute(KEY_ATTRIBUTE));
      if (!isNewChild) {
        continue;
      }

      const elements = [child, ...Array.from(child.querySelectorAll('*'))];
      for (const element of elements) {
        if (this.isWebComponent(element)) {
          renderPromises.push(element.componentOnReady());
        }
      }
    }

    await Promise.all(renderPromises);
  }

  private isWebComponent(element: Element): element is WebComponentElement {
    return typeof (element as Partial<WebComponentElement>).componentOnReady === 'function';
  }

  private getKeyedChildren(): Array<HTMLElement> {
    const children = this.hostElement.nativeElement.querySelectorAll<HTMLElement>(`[${KEY_ATTRIBUTE}]`);
    return Array.from(children);
  }

  private measureLayout(): LayoutSnapshot {
    const hostRect = this.hostElement.nativeElement.getBoundingClientRect();
    const children = new Map<string, { element: HTMLElement, top: number }>();

    for (const child of this.getKeyedChildren()) {
      children.set(child.getAttribute(KEY_ATTRIBUTE), {
        element: child,
        top: child.getBoundingClientRect().top
      });
    }

    return {
      hostTop: hostRect.top,
      hostHeight: hostRect.height,
      children
    };
  }

  /**
   * True when a position is on screen or within one screen height of it.
   * Children further away snap into place, which the user can't see anyway.
   */
  private isNearViewport(top: number): boolean {
    const viewportHeight = window.innerHeight;
    return top > -viewportHeight && top < viewportHeight * 2;
  }

  private prefersReducedMotion(): boolean {
    if (!window.matchMedia) {
      return false;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
