import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Store } from '@ngxs/store';
import { AuthenticationState } from '../authentication/authentication.state';

@Injectable()
export class PlantntInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const plant = this.store.selectSnapshot(AuthenticationState.activePlant);
    if (plant) {
      const modifiedRequest = req.clone({
        url: req.url.replace('ls51', plant)
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(req);
  }
}
