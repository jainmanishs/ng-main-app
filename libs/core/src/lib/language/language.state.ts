import { State, Selector, StateContext, Action } from '@ngxs/store';
import { SetupLanguage, SetLanguage } from './language.actions';

export interface LanguageStateModel {
  defaultLang: string;
  languages: string[];
  currentLang: any;
}

@State<LanguageStateModel>({
  name: 'language',
  defaults: {
    defaultLang: '',
    languages: [],
    currentLang: null
  }
})
export class LanguageState {
  @Selector()
  static getLangs({ languages }: LanguageStateModel) {
    return languages;
  }

  @Selector()
  static getCurrentLang({ currentLang }: LanguageStateModel) {
    return currentLang;
  }

  @Selector()
  static getDefaultLang({ defaultLang }: LanguageStateModel) {
    return defaultLang;
  }

  @Action(SetupLanguage)
  setupLang(
    { setState }: StateContext<LanguageStateModel>,
    { languages, defaultLang }
  ) {
    setState({
      languages: languages,
      currentLang: defaultLang,
      defaultLang: defaultLang
    });
  }

  @Action(SetLanguage)
  setLang(
    { patchState }: StateContext<LanguageStateModel>,
    { language }: SetLanguage
  ) {
    patchState({
      currentLang: language
    });
  }
}
