import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { AnimationController } from '@ionic/angular';
import { AnimateListChangesDirective } from './animate-list-changes.directive';

/**
 * A record of one animation the directive asked for.
 */
interface RequestedAnimation {
  element?: HTMLElement;
  properties: Array<string>;
}

/**
 * Stands in for Ionic's AnimationController and records what was requested,
 * so the tests don't depend on real animation timing.
 * Animations keep "running" until the test calls `finishAll()`.
 */
class AnimationControllerStub {
  public requested: Array<RequestedAnimation> = [];

  private finishRunningAnimations: Array<() => void> = [];

  public create(): unknown {
    const record: RequestedAnimation = { properties: [] };
    this.requested.push(record);

    const animation = {
      addElement: (element: HTMLElement) => {
        record.element = element;
        return animation;
      },
      fromTo: (property: string) => {
        record.properties.push(property);
        return animation;
      },
      duration: () => animation,
      delay: () => animation,
      easing: () => animation,
      fill: () => animation,
      play: () => {
        return new Promise<void>(resolve => {
          this.finishRunningAnimations.push(resolve);
        });
      },
      stop: () => { },
      destroy: () => { }
    };

    return animation;
  }

  public finishAll(): void {
    const finishers = this.finishRunningAnimations;
    this.finishRunningAnimations = [];

    for (const finish of finishers) {
      finish();
    }
  }

  /**
   * The items animating the given property, identified by their text.
   * (Text rather than `data-animate-key`, because ghosts of removed items no longer have the key.)
   */
  public itemsAnimating(property: string): Array<string> {
    return this.requested
      .filter(record => {
        return record.properties.includes(property);
      })
      .map(record => {
        return record.element.textContent.trim();
      });
  }
}

/**
 * Stands in for an Ionic (Stencil) element: it only reports it has rendered once the test says so.
 */
let resolveWebComponentRender: () => void;
let webComponentRendered: Promise<void>;

class TestWebComponent extends HTMLElement {
  public componentOnReady(): Promise<void> {
    return webComponentRendered;
  }
}

if (!customElements.get('test-web-component')) {
  customElements.define('test-web-component', TestWebComponent);
}

@Component({
  // The list is pinned to the top of the viewport, because the directive only animates items
  // near the viewport, and the test runner page may have pushed the fixture far down.
  template: `
    <div [appAnimateListChanges]="items" style="position: fixed; top: 0; left: 0; width: 200px;">
      <div
        *ngFor="let item of items; trackBy: trackByItem"
        [attr.data-animate-key]="item"
        style="display: block; height: 20px;"
      >
        {{item}}
        <test-web-component *ngIf="includeWebComponents"></test-web-component>
      </div>
    </div>
  `
})
class TestHostComponent {
  public items: Array<string> = [];
  public includeWebComponents = false;

  public trackByItem(index: number, item: string): string {
    return item;
  }
}

describe('AnimateListChangesDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let animationController: AnimationControllerStub;

  /**
   * Must be called inside fakeAsync: the directive starts animations asynchronously,
   * after any web components in new children have rendered.
   */
  function setItems(items: Array<string>): void {
    host.items = items;
    fixture.detectChanges();
    flush();
  }

  /**
   * The rendered element for an item, including ghosts of removed items.
   */
  function findItemElement(item: string): HTMLElement | undefined {
    const listElement: HTMLElement = fixture.nativeElement.firstElementChild;
    const itemElements = Array.from(listElement.children) as Array<HTMLElement>;

    return itemElements.find(element => {
      return element.textContent.trim() === item;
    });
  }

  function setReducedMotion(isReduced: boolean): void {
    spyOn(window, 'matchMedia').and.returnValue({ matches: isReduced } as MediaQueryList);
  }

  beforeEach(() => {
    animationController = new AnimationControllerStub();

    // The directive only animates items near the viewport. A hidden test runner window reports a
    // height of 0, which would make every item count as off-screen, so use a fixed height.
    spyOnProperty(window, 'innerHeight', 'get').and.returnValue(800);

    TestBed.configureTestingModule({
      declarations: [AnimateListChangesDirective, TestHostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AnimationController, useValue: animationController }
      ]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('does not animate the first time items arrive', fakeAsync(() => {
    setReducedMotion(false);

    setItems(['a', 'b', 'c']);

    expect(animationController.requested.length).toBe(0);
  }));

  it('slides only the items whose position changed', fakeAsync(() => {
    setReducedMotion(false);
    setItems(['a', 'b', 'c']);

    setItems(['b', 'a', 'c']);

    expect(animationController.itemsAnimating('transform').sort()).toEqual(['a', 'b']);
    expect(animationController.itemsAnimating('opacity')).toEqual([]);
  }));

  it('fades in only the items that are new', fakeAsync(() => {
    setReducedMotion(false);
    setItems(['a', 'b']);

    setItems(['a', 'b', 'c']);

    expect(animationController.itemsAnimating('opacity')).toEqual(['c']);
  }));

  it('fades out removed items as ghosts, then removes them', fakeAsync(() => {
    setReducedMotion(false);
    setItems(['a', 'b', 'c']);

    setItems(['a', 'c']);

    const ghost = findItemElement('b');
    expect(ghost).toBeDefined();
    expect(ghost.hasAttribute('data-animate-key')).toBe(false);
    expect(ghost.style.position).toBe('absolute');
    expect(animationController.itemsAnimating('opacity')).toEqual(['b']);

    animationController.finishAll();
    flush();
    expect(findItemElement('b')).toBeUndefined();
  }));

  it('removes the previous ghosts when the list changes again mid-animation', fakeAsync(() => {
    setReducedMotion(false);
    setItems(['a', 'b', 'c']);
    setItems(['a', 'c']);

    setItems(['a']);

    expect(findItemElement('b')).toBeUndefined();
    expect(findItemElement('c')).toBeDefined();
  }));

  it('waits for web components in new items to render before animating', fakeAsync(() => {
    setReducedMotion(false);
    webComponentRendered = new Promise(resolve => {
      resolveWebComponentRender = resolve;
    });
    host.includeWebComponents = true;
    setItems(['a', 'b']);

    setItems(['a', 'b', 'c']);
    expect(animationController.requested.length).toBe(0);

    resolveWebComponentRender();
    flush();
    expect(animationController.itemsAnimating('opacity')).toEqual(['c']);
  }));

  it('does not animate when the order is unchanged', fakeAsync(() => {
    setReducedMotion(false);
    setItems(['a', 'b', 'c']);

    setItems(['a', 'b', 'c']);

    expect(animationController.requested.length).toBe(0);
  }));

  it('does not animate when the user prefers reduced motion', fakeAsync(() => {
    setReducedMotion(true);
    setItems(['a', 'b', 'c']);

    setItems(['c', 'b', 'a', 'd']);

    expect(animationController.requested.length).toBe(0);
  }));
});
