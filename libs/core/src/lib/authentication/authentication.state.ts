import {
  State,
  Action,
  Selector,
  StateContext,
  createSelector
} from '@ngxs/store';
import {
  LoginApplication,
  LoginSuccess,
  LoginCanceled,
  Logout,
  LogoutDomain,
  LoginSuccessDomain,
  LoginApplicationDomain,
  FetchPlants,
  LoginErrorDomain,
  LoginAdfsSuccess,
  LoginAdfs,
  LogoutAdfs,
  LoginApplicationTest,
  LogoutTest,
  FetchAdfsPlants,
  SetActivePlant
} from './authentication.actions';

import { tap, map, catchError } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';

import { AuthenticatedUser } from './models/authenticated-user.model';

import * as jwt from 'jwt-decode';

export interface AuthenticationStateModel {
  token: string;
  tenants: string[];
  activeTenant: string;
  isLoggedIn: boolean;
  applicationForm: any;
  username: string;
  upn: string;
  primarySid: string;
  plant: any;
  plants: any[];
}

@State<AuthenticationStateModel>({
  name: 'authentication',
  defaults: {
    token: '',
    tenants: [],
    username: '',
    upn: '',
    primarySid: '',
    activeTenant: '',
    isLoggedIn: false,
    applicationForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {}
    },
    plant: '',
    plants: []
  }
})
export class AuthenticationState {
  constructor(private authService: AuthenticationService) { }

  ngxsOnInit({ dispatch }: StateContext<AuthenticationStateModel>) {
    this.authService.getIsAuthorized().subscribe(isAuthorized => {
      if (isAuthorized) {
        const username = this.authService.getUserName();
        const upn = this.authService.getUpn();
        const primarySid = this.authService.getPrimarySid();

        dispatch(new LoginAdfsSuccess(username, upn, primarySid));
      }
    });
  }

  @Selector()
  static token({ token }: AuthenticationStateModel) {
    return token;
  }

  @Selector()
  static plants({ plants }: AuthenticationStateModel) {
    return plants;
  }

  @Selector()
  static plant({ plant }: AuthenticationStateModel) {
    return createSelector(
      [AuthenticationState],
      (state: AuthenticationStateModel) => {
        return state.plants.find(p => p.viewValue === plant);
      }
    );
  }

  @Selector()
  static activePlant({ plant, plants }: AuthenticationStateModel) {
    const storedPlant = plants.find(p => p.viewValue === plant);
    if (storedPlant) {
      return storedPlant;
    }
    return plant;
  }

  @Selector()
  static getActiveplant({ plant }: AuthenticationStateModel) {
    // VISUALIZATOR HACK, REMOVE AFTER VISUALIZATOR WILL NOT BE USED ANYMORE
    const plantType: 'visualizator' | 'configurator' =
      typeof plant === 'object' ? 'visualizator' : 'configurator';

    if (plantType === 'visualizator') {
      return plant.viewValue;
    }

    if (plantType === 'configurator') {
      return plant;
    }
  }

  @Selector()
  static isLoggedIn({ isLoggedIn }: AuthenticationStateModel) {
    return isLoggedIn;
  }

  @Selector()
  static tenants({ tenants }: AuthenticationStateModel) {
    return tenants;
  }

  @Selector()
  static activeTenant({ activeTenant }: AuthenticationStateModel) {
    return activeTenant;
  }

  @Selector()
  static username({ username }: AuthenticationStateModel) {
    return username;
  }
  @Selector()
  static upn({ upn }: AuthenticationStateModel) {
    return upn;
  }
  @Selector()
  static primarySid({ primarySid }: AuthenticationStateModel) {
    return primarySid;
  }
  @Action(LoginApplication)
  loginApplication(
    { dispatch }: StateContext<AuthenticationStateModel>,
    { password, username }: LoginApplication
  ) {
    this.authService
      .loginApplication({ password, username })
      .subscribe(
        (user: AuthenticatedUser) => {
          console.log(user);
          dispatch(new LoginSuccess(user.token, username));
        },
        err => dispatch(new LoginCanceled())
      );
  }

  @Action(LoginApplicationTest)
  loginApplicationTest(
    { patchState }: StateContext<AuthenticationStateModel>,
    { username }: LoginApplication
  ) {
    patchState({
      token: 'testtest',
      username: username
    });
  }

  @Action(LoginCanceled)
  loginCanceled() { }

  @Action(LoginSuccess)
  loginSuccess(
    { patchState }: StateContext<AuthenticationStateModel>,
    { token, username }: LoginSuccess
  ) {
    const tenants = jwt(token).Tenant as string[];
    debugger
    patchState({
      token: token,
      tenants: tenants,
      activeTenant: tenants[0],
      isLoggedIn: true,
      username: username,
      plant: tenants[0],
      plants: tenants
    });
  }

  @Action(Logout)
  logout({ getState, setState }: StateContext<AuthenticationStateModel>) {
    const { plant, plants, activeTenant } = getState();

    return this.authService.logout().pipe(
      tap(() => {
        setState({
          token: '',
          tenants: [],
          activeTenant: activeTenant,
          isLoggedIn: false,
          applicationForm: null,
          username: '',
          upn: '',
          primarySid: '',
          plant: plant,
          plants: plants
        });
      })
    );
  }

  @Action(LogoutTest)
  logoutTest({ getState, setState }: StateContext<AuthenticationStateModel>) {
    const { plant, plants, activeTenant } = getState();

    setState({
      token: '',
      tenants: [],
      activeTenant: activeTenant,
      isLoggedIn: false,
      applicationForm: null,
      username: '',
      upn: '',
      primarySid: '',
      plant: plant,
      plants: plants
    });
  }

  @Action(LoginAdfs)
  loginAdfs() {
    this.authService.loginAdfs();
  }

  @Action(LoginAdfsSuccess)
  loginAdfsSuccess(
    { dispatch, patchState }: StateContext<AuthenticationStateModel>,
    { username, upn, primarySid }: LoginAdfsSuccess
  ) {
    patchState({
      isLoggedIn: true,
      username,
      upn,
      primarySid
    });
      debugger
    dispatch(new FetchAdfsPlants());
  }

  @Action(LogoutAdfs)
  LogoutAdfs({ patchState }: StateContext<AuthenticationStateModel>) {
    return this.authService.logoutAdfs();
  }

  @Action(LoginApplicationDomain)
  loginApplicationDomain(
    { dispatch }: StateContext<AuthenticationStateModel>,
    { domain, password, username, plant }: LoginApplicationDomain
  ) {
    return this.authService
      .loginApplicationDomain({ domain, password, username, plant })
      .pipe(
        map(({ token }: AuthenticatedUser) => {
          if (token) {
            return dispatch(new LoginSuccessDomain(token, plant, username));
          }
        }),
        catchError(() => dispatch(new LoginErrorDomain()))
      );
  }

  @Action(LoginSuccessDomain)
  loginSuccessDomain(
    { patchState }: StateContext<AuthenticationStateModel>,
    { token, plant, username }: LoginSuccessDomain
  ) {
    patchState({
      token: token,
      plant: plant,
      isLoggedIn: true,
      username: username
    });
  }

  @Action(LoginErrorDomain)
  loginCanceledDomain() { }

  @Action(LogoutDomain)
  logoutDomain({ getState, setState }: StateContext<AuthenticationStateModel>) {
    const { plant, plants, activeTenant } = getState();

    return this.authService.logoutDomain().pipe(
      tap(() => {
        setState({
          token: '',
          tenants: [],
          activeTenant: activeTenant,
          isLoggedIn: false,
          applicationForm: null,
          username: '',
          upn: '',
          primarySid: '',
          plant: plant,
          plants: plants
        });
      })
    );
  }

  @Action(FetchPlants)
  fetchPlants({ patchState }: StateContext<AuthenticationStateModel>) {
    const plants = this.authService.fetchPlants();

    patchState({ plants: plants });
  }

  @Action(FetchAdfsPlants)
  fetchAfdsPlants({ getState, patchState }: StateContext<AuthenticationStateModel>) {
    const groupName: string[] = this.authService.getPayloadFromIdToken()
      .GroupsName;
    const { plant } = getState();

    const plants: string[] = this.filterPlants(groupName);

    if (plants.length > 0) {
      if (plant.length === 0) {
        var setPlant = plants[0];
      } else {
        var setPlant = <string>plant;
      }
    } else {
      var setPlant = '';
    }

    patchState({
      plant: setPlant,
      plants: plants
    });
  }

  @Action(SetActivePlant)
  setActivePlant(
    { patchState }: StateContext<AuthenticationStateModel>,
    { plant }: AuthenticationStateModel
  ) {
    patchState({
      plant: plant
    });
  }

  private filterPlants(groupName: string[]): string[] {
    return groupName
      .filter(plants => plants.toUpperCase().includes('PLANTS'))
      .map(plants => plants.split('_')[2])
      .filter(plant => plant);
  }
}
