import { async, TestBed } from '@angular/core/testing';
import { CoreModule } from './core.module';
import { PreloadingModuleStrategy } from './strategies/preloading-strategy';
import { AuthenticationService } from './authentication/authentication.service';
import { BearerGuard } from './guards/bearer.guard';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { TenantInterceptor } from './interceptors/tenant.interceptor';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { AuthenticationState } from './authentication/authentication.state';
import { LanguageState } from './language/language.state';
import { environment } from '@orion/environment';
import { ConfigModule, ConfigLoader, configFactory } from '@ngx-config/core';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';

describe('CoreModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        CommonModule,
        NgxsModule.forRoot([AuthenticationState, LanguageState], {
          developmentMode: !environment.production
        }),
        ConfigModule.forRoot({
          provide: ConfigLoader,
          useFactory: configFactory,
          deps: [HttpClient]
        }),
        NgxsStoragePluginModule.forRoot({
          key: [
            'authentication.token',
            'authentication.tenants',
            'authentication.activeTenant',
            'authentication.isLoggedIn'
          ]
          // storage: StorageOption.SessionStorage
        })
      ],
      providers: [
        PreloadingModuleStrategy,
        AuthenticationService,
        BearerGuard,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TenantInterceptor,
          multi: true
        }
      ]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CoreModule).toBeDefined();
  });
});
