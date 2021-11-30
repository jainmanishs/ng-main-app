import { AuthorizationGuard } from './guards/authorization.guard';
import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { AuthenticationState } from './authentication/authentication.state';
import { LanguageState } from './language/language.state';
import { ConfigurationState } from './configuration/configuration.state';

/**
 * Interceptors
 */
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { VisualizatorInterceptor } from './interceptors/visualizator.interceptor';
import { PlantntInterceptor } from './interceptors/plant.interceptor';
import { TenantInterceptor } from './interceptors/tenant.interceptor';
import { ServerErrorInterceptor } from './interceptors/server-error.interceptor';

import { throwIfAlreadyLoaded } from './guards/module-loaded-once.guard';
import { AuthenticationService } from './authentication/authentication.service';
import { PreloadingModuleStrategy } from './strategies/preloading-strategy';

import { environment } from '../../../../src/environments/environment.prod';

import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NotificationService } from './services/notification.service';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import {PlantHealthCheckGuard} from "./guards";
// import {PlantHealthCheckService} from "../../../../src/app/services/plant-health-check.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgxsModule.forRoot(
      [AuthenticationState, LanguageState, ConfigurationState],
      {
        developmentMode: !environment.production
      }
    ),
    NgxsStoragePluginModule.forRoot({
      key: [
        'authentication.token',
        'authentication.tenants',
        'authentication.activeTenant',
        'authentication.isLoggedIn',
        'authentication.username',
        'authentication.plant',
        'authentication.plants',
        'feedback.feedbackData',
        'supplyvisibility.partNumberListParameters'
      ]
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),
    NgxsFormPluginModule.forRoot(),
    MatSnackBarModule
  ],
  providers: [
    PreloadingModuleStrategy,
    AuthenticationService,
    AuthorizationGuard,
    PlantHealthCheckGuard,
    // PlantHealthCheckService,
    NotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PlantntInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: VisualizatorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
