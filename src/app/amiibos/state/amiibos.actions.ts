export namespace AmiibosActions {
  export class LoadAmiibos {
    public static readonly type = '[Amiibos] Load';

    constructor(
      public readonly type: string
    ) { }
  }

  export class LoadUserAmiibos {
    public static readonly type = '[Amiibos] Load User Amiibos';

    constructor(
      public readonly userUid: string
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

    constructor(
      public readonly amiiboSlug: string,
      public readonly isCollected: boolean
    ) { }
  }
}
