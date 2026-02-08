import { Injectable } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";
import { AmiibosStore } from "./amiibos.store";

@Injectable()
export class AmiibosService {
  // Convert signals to observables for backward compatibility
  public readonly amiibos$ = toObservable(this.store.selectedAmiibos);

  public readonly selectedSeries$ = toObservable(this.store.filters).pipe(
    map(filters => filters.series ?? '')
  );

  public readonly collectedAmiibos$ = toObservable(this.store.collectedAmiibos);

  public readonly progress$ = toObservable(this.store.progress);

  constructor(
    private readonly store: AmiibosStore
  ) { }

  public setFilters(filters: { type?: string, series?: string }): void {
    this.store.setFilters(filters);
  }

  public async toggleAmiibo(slug: string, collected: boolean): Promise<void> {
    await this.store.toggleAmiibo(slug, collected);
  }
}