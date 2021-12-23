import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthenticationState } from '../authentication/authentication.state';
import { ConfigService } from '@ngx-config/core';
import { mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication';
import { OidcConfigService, OidcSecurityService } from 'angular-auth-oidc-client';
import { OidcSecurityUserService } from 'angular-auth-oidc-client/lib/services/oidc.security.user-service';
import { OidcSecuritySilentRenew } from 'angular-auth-oidc-client/lib/services/oidc.security.silent-renew';
import { OidcSecurityCommon } from 'angular-auth-oidc-client/lib/services/oidc.security.common';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private store: Store,
    private injector: Injector,
    private authenticationService: AuthenticationService,
    private oidcSecurityService: OidcSecurityService,

  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return Observable.create((observer: any) => {
      const item = this.injector.get(ConfigService);
      observer.next(item);
      observer.complete();
    }).pipe(
      mergeMap((res: ConfigService) => {
    
        const settings = res.getSettings();
        let modifiedRequest;
        // return next.handle(req);
        console.log(req.url)
        debugger
        if (settings && settings.version && !req.url.includes('well-known') && !req.url.includes('https://adfs-proxy.cz.foxconn.com/')
        //  && !this.authenticationService.isGeneratingToken
        ) {
          const { version } = settings;

          switch (version) {
            case 'visualizator':
              modifiedRequest = this.setTokenHeaders(req);
              return next.handle(modifiedRequest);
            case 'orion':
              modifiedRequest = this.setAuthorizationHeaders(req);
              return next.handle(modifiedRequest);
            case 'orion-adfs':
              modifiedRequest = this.setAuthorizationAdfsHeaders(req);
              return next.handle(modifiedRequest);
            default:
              return next.handle(req);
          }
        }else{
          // req = req.clone({
          //   headers: req.headers.append('Access-Control-Allow-Origin','*')
          // });
        }

        return next.handle(req);
      })
    );
  }

  /**
   * Sets token to header for every request
   * @param request
   */
  private setTokenHeaders(request: HttpRequest<any>) {
    const token = this.store.selectSnapshot(AuthenticationState.token);

    if (!!token) {
      return request.clone({
        headers: request.headers.append('token', token)
      });
    }
    return request;
  }

  /**
   * Sets Authorization header for every request
   * @param request
   */
  private setAuthorizationHeaders(request: HttpRequest<any>) {
    const token = this.store.selectSnapshot(AuthenticationState.token);

    if (!!token) {
      return request.clone({
        headers: request.headers.append('Authorization', `Bearer ${token}`)
      });
    }

    return request;
  }

  /**
   * Sets Authorization header for every request
   * @param request
   */
  private setAuthorizationAdfsHeaders(request: HttpRequest<any>) {
    const token = this.authenticationService.getIdToken();
  
    if (!!token) {
      return request.clone({
        headers: request.headers.append('Authorization', `Bearer ${token}`)
      });
    }
    console.log(request.headers)
    return request;
  }
}
