export namespace AmiibosActions {
  export class LoadAmiibos {
    public static readonly type = '[Amiibos] Load Amiibos';
  }

  export class LoadUserAmiibos {
    public static readonly type = '[Amiibos] Load User Amiibos';

    constructor(
      public readonly userUid: string
    ) { }
  }

  export class SetFilters {
    public static readonly type = '[Amiibos] Set filters';

    constructor(
      public readonly filters: { type?: string, series?: string }
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
