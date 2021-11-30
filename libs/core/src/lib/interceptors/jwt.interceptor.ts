import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthenticationState } from '../authentication/authentication.state';
import { ConfigService } from '@ngx-config/core';
import { mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private store: Store,
    private injector: Injector,
    private authenticationService: AuthenticationService
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

        if (settings && settings.version && !req.url.includes('well-known')) {
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

    return request;
  }
}
