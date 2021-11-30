import { Injectable } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService, AuthenticationState } from '../authentication';
import { ConfigService } from '@ngx-config/core';
import { Store } from '@ngxs/store';
import { Location } from '@angular/common';

declare var window: any; // Needed on Angular 8+

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private configService: ConfigService,
    private store: Store,
    private location: Location
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const { version } = this.configService.getSettings();

    switch (version) {
      case 'orion':
      case 'visualizator':
        return this.checkToken();
      case 'orion-adfs':
        return this.checkUserAuthorized(state);
    }
  }

  /**
   * Checks token availability in store
   * Client without token is redirected to the login page
   */
  private checkToken(): Observable<boolean> | Promise<boolean> | boolean {
    const token = !!this.store.selectSnapshot(AuthenticationState.token);

    if (!token) {
      this.router.navigate(['/home']);
    }

    return true;
  }

  private checkUserAuthorized(state: RouterStateSnapshot): Observable<boolean> {
    return this.authenticationService.getIsAuthorized().pipe(
      map((isAuthorized: boolean) => {
        if (!isAuthorized) {
          const parsedUrl = new URL(window.location.href);
          const baseUrl = parsedUrl.origin;

          this.authenticationService.setRedirectUrl(baseUrl + this.location.path(true));
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      })
    );
  }
}
