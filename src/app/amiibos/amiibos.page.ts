import { Component, OnInit } from '@angular/core';
import { AmiibosService, AmiiboModel } from './amiibos.service';

@Component({
  selector: 'app-amiibos',
  templateUrl: './amiibos.page.html',
  styleUrls: ['./amiibos.page.scss'],
})
export class AmiibosPage implements OnInit {

  public amiibos: Array<AmiiboModel> = [];
  public collectedAmiibos: { [slug: string]: boolean } = {};

  public constructor(
    private readonly amiibosService: AmiibosService
  ) { }

  public ngOnInit() {
    this.amiibos = this.amiibosService.getAmiibos();
  }

  public isCollected(slug: string): boolean {
    return this.collectedAmiibos[slug] || false;
  }

  public toggleAmiibo(slug: string, $event: any): void {
    console.log($event);
    this.collectedAmiibos[slug] = !this.collectedAmiibos[slug];
  }

  public getCollectedAmiibos(): number {
    return Object.values(this.collectedAmiibos).filter(value => value).length;
  }

  public getProgress(): number {
    if (this.amiibos.length === 0) {
      return 0;
    }

    return this.getCollectedAmiibos() / this.amiibos.length;
  }
}
