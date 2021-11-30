export class SetLanguage {
  static readonly type = '[Language] SetLanguage';

  constructor(public readonly language: any) {}
}

export class SetupLanguage {
  static readonly type = '[Language] SetupLanguage';

  constructor(
    public readonly languages: any[],
    public readonly defaultLang: any
  ) {}
}
