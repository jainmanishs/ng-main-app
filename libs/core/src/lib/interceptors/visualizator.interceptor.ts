import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Store } from '@ngxs/store';
import { ConfigService } from '@ngx-config/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthenticationState } from '../authentication';

@Injectable()
export class VisualizatorInterceptor implements HttpInterceptor {
  constructor(
    private readonly store: Store,
    private readonly injector: Injector
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const plantSnapshot = <{ value: number; viewValue: string }>(
      this.store.selectSnapshot(AuthenticationState.activePlant)
    );
    let plantId;
    return Observable.create((observer: any) => {
      const item = this.injector.get(ConfigService);
      observer.next(item);
      observer.complete();
    }).pipe(
      mergeMap((res: ConfigService) => {
        const settings = res.getSettings();

        if (plantSnapshot && plantSnapshot.value) {
          plantId = plantSnapshot.value;
        } else {
          plantId = '';
        }

        if (settings && settings.version && !req.url.includes('well-known')) {
          if (settings.version === 'visualizator') {
            const modifiedRequest = req.clone({
              headers: req.headers
                .append('clientId', '1')
                .append('MENUELEMENTID', plantId)
            });
            return next.handle(modifiedRequest);
          }
        }

        return next.handle(req);
      })
    );
  }
}
