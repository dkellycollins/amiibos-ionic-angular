import { UserAmiiboModel } from '../models/user-amiibo.model';

export namespace AmiibosActions {
  export class LoadAmiibos {
    public static readonly type = '[Amiibos] Load';
  }

  export class LoadUserAmiibos {
    public static readonly type = '[Amiibos] Load User Amiibos';

    constructor(public readonly userUid: string) { }
  }

  export class SetUserAmiibos {
    public static readonly type = '[Amiibos] Set User Amiibos';

    constructor(
      public readonly payload: Array<UserAmiiboModel>
    ) { }
  }

  export class SelectSeries {
    public static readonly type = '[Amiibos] Select series';

    constructor(
      public readonly series: string
    ) { }
  }

  export class ToggleAmiibo {
    public static readonly type = '[Amiibos] Toggle';

    public readonly source: string;

    constructor(
      public readonly amiiboSlug: string,
      public readonly isCollected: boolean
    ) { }
  }
}
