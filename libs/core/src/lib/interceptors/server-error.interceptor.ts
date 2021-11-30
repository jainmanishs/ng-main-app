import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { NotificationService } from '../services';
import { ERROR } from '../enums/error.enum';
import { TranslateService } from '@ngx-translate/core';
import { Router } from "@angular/router";
// import { PlantHealthCheckDialog } from "../../../../../apps/orion/src/app/plant-health-check/plant-health-check-dialog/plant-health-check-dialog.component";
import { MatDialog } from "@angular/material";
import { Store } from "@ngxs/store";
import { LanguageState } from "../language";

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  /*
   * When backend return 401 HTTP status (user is unauthorized) don't show other error messages
   * for example error about insufficient rights 403 status
   */
  static unauthorizedErrorOccurred = false;

  constructor(
    private router: Router,
    private readonly store: Store,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clone the request to add the new header
    const languageSnapshot = <{ code: string, language: string, description: string }>(
      this.store.selectSnapshot(LanguageState.getCurrentLang)
    );
    var clonedRequest = req;
    if (languageSnapshot) {
      clonedRequest = req.clone({ headers: req.headers.append('Accept-Language', languageSnapshot.language) });
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: any) => {
        if (!this.isLoginPage(error)) {
          const { status } = error;

          switch (status) {
            case ERROR.BAD_REQUEST:
              this.displayForbiddenMessage(false, this.getExtractedErrorMessage(error));
              break;
            case ERROR.UNAUTHORIZED:
              ServerErrorInterceptor.unauthorizedErrorOccurred = true;
              this.displayForbiddenMessage(true);
              break;
            case ERROR.FORBIDDEN:
              if (ServerErrorInterceptor.unauthorizedErrorOccurred === false) {
                this.displayForbiddenMessage(false, this.getExtractedErrorMessage(error));
              }
              break;
          }
        }

        return throwError(error);
      })
    );
  }

  getExtractedErrorMessage(error) {
    const defaultErrorMessage = "Error occured, please contact administrator!";
    if (error && error.error) {

      const extractedErrorObj = error.error;

      if (extractedErrorObj.errors && extractedErrorObj.errors.Name) {
        return extractedErrorObj.errors.Name.join("<br>");
      }

      else if (extractedErrorObj.detail) {
        return extractedErrorObj.detail;
      }

    }
    return defaultErrorMessage;
  }

  /**
   * Checks if activated route is login
   */
  private isLoginPage = ({ url }: HttpErrorResponse) => url.includes('/login');

  /**
   * Displays snackbar with message that user access was forbidden
   */
  private displayForbiddenMessage(redirectToHome: Boolean, message?: String) {
    let msg = message ? message : this.translate.instant('error.forbidden');
    let snackBarRef = this.notificationService.showError(
      msg,
      5000
    );

    if (redirectToHome) {
      snackBarRef.afterDismissed().subscribe(info => {
        this.router.navigate(['/home']);
      });
    }
  }
}
