import { DestroyRef, Injectable, signal, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthStore } from 'src/app/auth/services/auth.store';
import { AmiiboModel } from '../models/amiibo.model';
import { CollectableAmiiboModel } from '../models/collectable-amiibo.model';
import { UserAmiiboModel } from '../models/user-amiibo.model';
import { AmiibosFirestore } from './amiibos.firestore';
import { UserAmiibosFirestore } from './user-amiibos.firestore';
import { UserAmiibosLocalStorage } from './user-amiibos.local-storage';

export interface AmiibosFilters {
  type: string | null;
  series: string | null;
}

@Injectable({ providedIn: 'root' })
export class AmiibosStore {
  private readonly destroyRef = inject(DestroyRef);

  // Private writable signals
  private readonly allAmiibosList = signal<Array<AmiiboModel>>([]);
  private readonly userAmiibosList = signal<Array<UserAmiiboModel>>([]);
  private readonly filtersSignal = signal<AmiibosFilters>({ type: null, series: null });

  // Public readonly signals
  public readonly allAmiibos = this.allAmiibosList.asReadonly();
  public readonly userAmiibos = this.userAmiibosList.asReadonly();
  public readonly filters = this.filtersSignal.asReadonly();

  // Computed signals
  public readonly selectedAmiibos = computed(() => {
    const amiibos = this.allAmiibosList();
    const filters = this.filtersSignal();

    return amiibos.filter(amiibo => {
      const typeMatch = !filters.type || amiibo.type === filters.type;
      const seriesMatch = !filters.series || amiibo.series === filters.series;
      return typeMatch && seriesMatch;
    });
  });

  public readonly collectedAmiibos = computed(() => {
    const amiibos = this.selectedAmiibos();
    const userAmiibos = this.userAmiibosList();

    return amiibos.map(amiibo => {
      const userAmiibo = userAmiibos.find(ua => ua.amiiboSlug === amiibo.slug);
      return {
        ...amiibo,
        isCollected: userAmiibo?.isCollected ?? false
      } as CollectableAmiiboModel;
    });
  });

  public readonly progress = computed(() => {
    const amiibos = this.collectedAmiibos();
    const collected = amiibos.filter(a => a.isCollected).length;
    return {
      total: amiibos.length,
      collected: collected
    };
  });

  public readonly series = computed(() => {
    const amiibos = this.allAmiibosList();
    const selectedType = this.filtersSignal().type;

    if (!selectedType) return [];

    return amiibos
      .filter(amiibo => amiibo.type === selectedType)
      .map(amiibo => amiibo.series)
      .filter((series): series is string => !!series)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  });

  constructor(
    private readonly amiibosFirestore: AmiibosFirestore,
    private readonly userAmiibosFirestore: UserAmiibosFirestore,
    private readonly userAmiibosLocalStorage: UserAmiibosLocalStorage,
    private readonly authStore: AuthStore
  ) {
    this.initializeFirestoreSync();
  }

  public setFilters(filters: Partial<AmiibosFilters>): void {
    this.filtersSignal.update(current => ({ ...current, ...filters }));
  }

  public async toggleAmiibo(slug: string, collected: boolean): Promise<void> {
    const user = this.authStore.user();

    if (user) {
      await this.userAmiibosFirestore.update(`${slug}:${user.uid}`, {
        userUid: user.uid,
        amiiboSlug: slug,
        isCollected: collected
      });
    } else {
      this.userAmiibosLocalStorage.update(slug, collected);
    }
  }

  private initializeFirestoreSync(): void {
    // Subscribe to all amiibos
    this.amiibosFirestore.collection$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(amiibos => this.allAmiibosList.set(amiibos));

    // Subscribe to user amiibos - reload when auth state changes
    this.loadUserAmiibos();
  }

  private loadUserAmiibos(): void {
    const user = this.authStore.user();
    const source$ = user
      ? this.userAmiibosFirestore.collectionByUser$(user.uid)
      : this.userAmiibosLocalStorage.collection$();

    source$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(userAmiibos => this.userAmiibosList.set(userAmiibos));
  }
}
