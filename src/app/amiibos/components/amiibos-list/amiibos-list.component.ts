import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AmiiboModel } from '../../services/AmiiboModel';
import { debounce } from 'lodash';

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

  private selectedAmiibo: string | null = null;

  public onItemClick = debounce((slug: string): void => {
    this.selectedAmiibo = this.selectedAmiibo === slug ? null : slug;
  }, 100);

  public isSelected(slug: string): boolean {
    return this.selectedAmiibo === slug;
  }

  public onCollectedChanged(slug: string, collected: boolean): void {
    this.collectedChanged.next({ slug, collected });
  }

  public getAmiiboId(amiibo: AmiiboModel): string {
    return amiibo.slug;
  }
}
