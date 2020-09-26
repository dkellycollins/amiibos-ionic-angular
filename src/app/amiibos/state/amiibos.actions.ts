
export namespace AmiibosActions {
  export class LoadAmiibos {
    public static readonly type = '[Amiibos] Load';
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