import { AmiiboModel } from './amiibo.model';

export interface CollectableAmiiboModel extends AmiiboModel {
  isCollected: boolean;
}
