import { BreadCrumb } from './models/breadcrumb';
import {
  SetApplicationUrl,
  UpdateApplicationUrl
} from './configuration.actions';
import { State, Selector, Action, StateContext } from '@ngxs/store';

export interface ConfigurationStateModel {
  breadCrumb: BreadCrumb[];
}

@State<ConfigurationStateModel>({
  name: 'configuration',
  defaults: {
    breadCrumb: [
      {
        label: '',
        url: ''
      }
    ]
  }
})
export class ConfigurationState {
  constructor() {}

  @Selector()
  static url({ breadCrumb }: ConfigurationStateModel) {
    return breadCrumb;
  }

  @Action(SetApplicationUrl)
  setApplicationUrl(
    { patchState, getState }: StateContext<ConfigurationStateModel>,
    { breadCrumb }: SetApplicationUrl
  ) {
    patchState({
      breadCrumb
    });
  }

  @Action(UpdateApplicationUrl)  
  updateApplicationUrl(
    { setState, getState }: StateContext<ConfigurationStateModel>,
    { breadcrumbInfo }: UpdateApplicationUrl
  ) {
    setState({ breadCrumb: [...getState().breadCrumb, ...breadcrumbInfo] });
  }
}