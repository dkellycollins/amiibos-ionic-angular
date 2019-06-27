import { Component, Input } from '@angular/core';
import { AmiiboModel } from '../../services/AmiiboModel';
import { debounce } from 'lodash';

@Component({
  selector: 'app-amiibos-list',
  templateUrl: './amiibos-list.component.html',
  styleUrls: ['./amiibos-list.component.scss'],
})
export class AmiibosListComponent {

  @Input()
  public amiibos: Array<AmiiboModel>;

  private selectedAmiibo: string | null = null;

  public isSelected(slug: string): boolean {
    return this.selectedAmiibo === slug;
  }

  public onItemClick = debounce((slug: string): void => {
    console.log(slug);
    this.selectedAmiibo = this.selectedAmiibo === slug ? null : slug;
  }, 100);

  public getAmiiboId(amiibo: AmiiboModel): string {
    return amiibo.slug;
  }
}
