import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAmiibosService {

  private readonly collectedAmiibos: { [slug: string]: boolean };

  public constructor() {
    this.collectedAmiibos = this.load();
  }

  public getCollectedAmiibos(): Array<string> {
    return Object.entries(this.collectedAmiibos)
      .filter(([_, collected]) => collected)
      .map(([map]) => map);
  }

  public toggleAmiibo(slug: string, collected: boolean) {
    this.collectedAmiibos[slug] = collected;
    this.save();
  }

  private save() {
    try {
      localStorage.setItem('UserAmiibosService.collectedAmiibos', JSON.stringify(this.collectedAmiibos));
    }
    catch (error) {
      console.error(error);
    }
  }

  private load(): { [key: string]: boolean } {
    try {
      const data = localStorage.getItem('UserAmiibosService.collectedAmiibos');
      
      if (!data) {
        return {};
      }
      return JSON.parse(data);
    }
    catch (error) {
      console.error(error);
      return {};
    }
  }
}
