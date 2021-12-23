import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import {
  AuthModule,
  OidcSecurityService,
  ConfigResult,
  OidcConfigService,
  OpenIdConfiguration,
  AuthWellKnownEndpoints
} from 'angular-auth-oidc-client';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { App1SharedModule } from 'projects/ng-app-one/src/app/app.module';
import { App2SharedModule } from 'projects/ng-app-two/src/app/app.module';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCommonModule, MatFormField, MatFormFieldModule, MatInput, MatInputModule, MatProgressSpinner, MatProgressSpinnerModule, MatRippleModule } from '@angular/material';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigHttpLoader } from '@ngx-config/http-loader';
import { ConfigLoader, ConfigModule } from '@ngx-config/core';
import { LoginComponent } from './public/login/login.component';
import { UnauthorizedComponent } from './public/unauthorized/unauthorized.component';
import { NotFoundComponent } from './public/not-found/not-found.component';
import { AuthenticationService } from 'libs/core/src/lib/authentication';
import { CoreModule } from 'libs/core/src';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { routes } from './app-routing.module';
import { DashboardComponent } from './private/dashboard/dashboard.component';
import { OidcSecurityCommon } from 'angular-auth-oidc-client/lib/services/oidc.security.common';
import { SharedModule } from './shared/shared.module';
import { SlowBuffer } from 'buffer';

/**
 * Loads init translation from assets i18
 * @param http
 */
 export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/app/', '.json?'+'v=0001');
}
/**
 * Loads Oauth configuration from assets folder
 * @param oidcConfigService
 */
 export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.load('./assets/auth/oauth-configuration.json');
}
/**
 * Loads init configuration from assets
 * @param http
 */
 export function configFactory(http: HttpClient): ConfigLoader {
  return new ConfigHttpLoader(
    http,
    `./assets/config/config.${environment.name}.json`
  );
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    UnauthorizedComponent,
    NotFoundComponent,
    LoginComponent,
    DashboardComponent,

  ],
  imports: [
    SharedModule,
    App1SharedModule.forRoot(),
    App2SharedModule.forRoot(),
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      initialNavigation: true
    }),
    TranslateModule.forRoot({
      isolate: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ConfigModule.forRoot({
      provide: ConfigLoader,
      useFactory: configFactory,
      deps: [HttpClient]
    }),
    AuthModule.forRoot(),
    AuthModule.forRoot(),
    CoreModule,
    HttpClientModule ,
    BrowserModule,
    AppRoutingModule,
    FormsModule,   
    ReactiveFormsModule,   
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCommonModule,
    MatProgressSpinnerModule

  ],
  providers: [ /*  {
    provide: MissingTranslationHandler,
    useClass: MissingTranslationService
  }, */
  { provide: LocationStrategy, useClass: PathLocationStrategy },
  OidcConfigService,
  OidcSecurityService,
  AuthenticationService,
  {
    provide: APP_INITIALIZER,
    useFactory: loadConfig,
    deps: [OidcConfigService],
    multi: true
  }],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private oidcConfigService: OidcConfigService,
  ) {
    this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {

        const config: OpenIdConfiguration = { ...configResult.customConfig };

        const wellKnownEndpoints: AuthWellKnownEndpoints = { ...configResult.authWellknownEndpoints };
        wellKnownEndpoints.token_endpoint = `${config.stsServer}/oauth2/token`;
        wellKnownEndpoints.jwks_uri = `${config.stsServer}/discovery/keys`;
        wellKnownEndpoints.userinfo_endpoint = `${config.stsServer}/userinfo`;
        // const authSettings: any = {
        //   "stsServer":"https://adfs-proxy.cz.foxconn.com/C86xtA6JDGad6bUS/adfs",
        //   "redirect_url": "https://localhost:44360/home",
        //   "client_id": "60c7d535-048c-417d-ad24-9aa27d166ee4",
        //   "response_type": "code",
        //   "scope": "openid profile",
        //   "post_logout_redirect_uri": "https://localhost:44360/home",
        //   "start_checksession": true,
        //   "silent_renew": true,
        //   "silent_renew_url": "https://localhost:44360/silent-renew.html",
        //   "post_login_route": "/home",
        //   "forbidden_route": "/forbidden",
        //   "unauthorized_route": "/unauthorized",
        //   "log_console_warning_active": true,
        //   "log_console_debug_active": true,
        //   "max_id_token_iat_offset_allowed_in_seconds": 100,
        //   "auto_userinfo": false,
        //   "iss_validation_off": true,
        //   "trigger_authorization_result_event": true,
        //   "renewTimeBeforeTokenExpiresInSeconds":3500
        // }
        this.oidcSecurityService.setupModule(config,wellKnownEndpoints);

    });
  }
 }



