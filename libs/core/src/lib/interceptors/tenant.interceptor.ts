import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Store } from '@ngxs/store';
import { AuthenticationState } from '../authentication/authentication.state';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const tenant = this.store.selectSnapshot(AuthenticationState.activeTenant);
    console.log(tenant);
    if (tenant) {
      const modifiedRequest = req.clone({
        //headers: req.headers.append('Tenant', tenant),
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(req);
  }
}
