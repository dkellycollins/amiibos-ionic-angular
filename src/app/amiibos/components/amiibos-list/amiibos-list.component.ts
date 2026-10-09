import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AmiiboModel } from '../../models/amiibo.model';

@Component({
  selector: 'app-amiibos-list',
  templateUrl: './amiibos-list.component.html',
  styleUrls: ['./amiibos-list.component.scss'],
})
export class AmiibosListComponent {

  @Input()
  public amiibos?: Array<AmiiboModel & { isCollected: boolean }>;

  @Output()
  public collectedChanged: EventEmitter<{ slug: string, collected: boolean }> = new EventEmitter();

  /**
   * Emits the slug of the Amiibo that was tapped.
   */
  @Output()
  public amiiboSelected: EventEmitter<string> = new EventEmitter();

  public onCollectedChanged(slug: string, collected: boolean): void {
    this.collectedChanged.next({ slug, collected });
  }

  public onAmiiboSelected(slug: string): void {
    this.amiiboSelected.next(slug);
  }

  /**
   * `trackBy` for the list, so each Amiibo keeps its own element when the list is sorted or filtered.
   */
  public getAmiiboId(index: number, amiibo: AmiiboModel): string {
    return amiibo.slug;
  }
}
