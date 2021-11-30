import {Inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { ConfigService } from '@ngx-config/core';
import {AuthorizationResult, AuthorizationState, OidcSecurityService, ValidationResult} from 'angular-auth-oidc-client';
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";
import {ServerErrorInterceptor} from "../interceptors/server-error.interceptor";

export const authUrlPaths = {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout'
};

@Injectable()
export class AuthenticationService {
  private isAuthenticated = new Subject<boolean>();
  isAuthenticated$ = this.isAuthenticated.asObservable();
  private hasStorage: boolean;

  constructor(
    private router: Router,
    private readonly httpClient: HttpClient,
    private readonly config: ConfigService,
    private readonly oidcSecurityService: OidcSecurityService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.hasStorage = typeof Storage !== 'undefined';

    if (this.oidcSecurityService.moduleSetup) {
      this.doCallbackLogicIfRequired();
    } else {
      this.oidcSecurityService.onModuleSetup.subscribe(() => {
        this.doCallbackLogicIfRequired();
      });
    }

    this.oidcSecurityService.getIsAuthorized().subscribe(auth => {
      this.isAuthenticated.next(auth);
    });

    this.oidcSecurityService.onAuthorizationResult.subscribe(
      (authorizationResult: AuthorizationResult) => {
        debugger
        //Testing
        const authorizationResult2:AuthorizationResult = new AuthorizationResult (
          AuthorizationState.authorized,
          ValidationResult.Ok,
          false
      );
        this.onAuthorizationResultComplete(authorizationResult2);

      });
  }

  loginAdfs() {
    this.oidcSecurityService.authorize();
  }

  /**
   * Stores the URL so we can redirect after signing in.
   */
  public getRedirectUrl(): string {
    if (this.hasStorage) {
      return sessionStorage.getItem('redirectUrl');
    }
    return null;
  }

  public setRedirectUrl(url: string): void {
    if (this.hasStorage) {
      sessionStorage.setItem('redirectUrl', url);
    }
  }

  public removeRedirectUrl(): void {
    sessionStorage.removeItem('redirectUrl');
  }

  getUserName() {
    const {
      unique_name,
      upn
    } = this.oidcSecurityService.getPayloadFromIdToken();
    const usernameSplit: string[] = unique_name.split('\\');
    const username = usernameSplit.pop();

    return username || upn;
  }
  getUpn() {
    const {
      upn
    } = this.oidcSecurityService.getPayloadFromIdToken();
    return  upn;
  }
  getPrimarySid() {
    const {
      primarysid
    } = this.oidcSecurityService.getPayloadFromIdToken();
    return  primarysid;
  }

  getIsAuthorized() {
    return this.oidcSecurityService.getIsAuthorized();
  }

  getIdToken() {
    return this.oidcSecurityService.getIdToken();
  }

  getToken() {
    return this.oidcSecurityService.getToken();
  }

  getPayloadFromIdToken() {
    return this.oidcSecurityService.getPayloadFromIdToken();
  }

  logoutAdfs() {
    this.oidcSecurityService.logoff();
  }

  loginApplication({ username, password }): Observable<any> {
    const apiBaserUrl = this.config.getSettings<string>('login.apiLoginUrl');
    return this.httpClient.post(`${apiBaserUrl}${authUrlPaths.LOGIN}`, {
      username,
      password
    });
  }

  logout(): Observable<any> {
    const apiBaserUrl = this.config.getSettings<string>('login.apiLoginUrl');
    return this.httpClient.post(`${apiBaserUrl}${authUrlPaths.LOGOUT}`, null);
  }

  /**
   *  Log in user via domain
   * @param domain Selected domain by user
   * @param username User login name
   * @param password User password
   * @param plant Selected plant by user
   */
  loginApplicationDomain({
    domain,
    username,
    password,
    plant
  }): Observable<any> {
    const apiBaserUrl = this.config.getSettings<string>('login.apiLoginUrl');
    return this.httpClient.post(`${apiBaserUrl}`, {
      domain,
      username,
      password,
      plant
    });
  }

  /**
   * Log in user via active directory
   * @param data User login data
   */
  activeDirectory(data): Observable<any> {
    const apiBaserUrl = this.config.getSettings<string>('login.apiLoginUrl');
    return this.httpClient.post(`${apiBaserUrl}`, data);
  }

  /**
   * Log out user logged by domain
   */
  logoutDomain(): Observable<any> {
    const apiDomainLogautURL = this.config.getSettings<string>(
      'login.apiLogoutUrl'
    );
    return this.httpClient.get(`${apiDomainLogautURL}`);
  }

  /**
   * Fetches plants from configuration
   * @returns list of plants
   */
  fetchPlants() {
    return this.config.getSettings('plants');
  }

  private doCallbackLogicIfRequired() {
    this.oidcSecurityService.authorizedCallbackWithCode(
      window.location.toString()
    );
  }

  private onAuthorizationResultComplete(authorizationResult: AuthorizationResult) {
    switch (authorizationResult.authorizationState) {
      case AuthorizationState.authorized:
        // Gets the redirect URL from authentication service.
        // If no redirect has been set, uses the default.
        if (this.getRedirectUrl()) {
          const redirectUrl = this.getRedirectUrl();
          this.removeRedirectUrl();
          ServerErrorInterceptor.unauthorizedErrorOccurred = false;
          this.document.location.href = redirectUrl;
        } else {
          this.router.navigate(['/dashboard']);
        }

        break;
      case AuthorizationState.forbidden:
      case AuthorizationState.unauthorized:
        this.router.navigate(['/home']);
        break;
      default:
        this.router.navigate(['/home']);
    }
  }
}
