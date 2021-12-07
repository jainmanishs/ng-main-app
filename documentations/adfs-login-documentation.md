#Implement Adfs Login (Orion)

**Copy Auth Libs and Already Built Interceptors**

> Note: - We Are Using Angular-oidc-client package for oidc operations

**Add Providers in AppModule.ts**

```
{provide:LocationStrategy,useClass:PathLocationStrategy},
OidcConfigService,
OidcSecurityService,
AuthenticationService,
{
 provide: APP_INITIALIZER,
 useFactory: loadConfig,
 deps: [OidcConfigService],
 multi: true
}],
```

**Now Add Config Loader in AppModule.ts which will load config.json and other api.json from Assets And Setup Oidc Module**

export class AppModule {

```
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


        this.oidcSecurityService.setupModule(config, wellKnownEndpoints);

      });
  }
```

}

**Initiate Login & Calling Adfs Server**

> Note: - make sure config fields details are correct

```

this.oidcSecurityService.authorize();

```

**check login result**

```

this.oidcSecurityService.getIsAuthorized().subscribe(auth => {
   //Logic
});

```

##Add Silent Login Feature

**create silent-renew.html in " main-app-name/src "**

```
<!DOCTYPE html>
<html>
  <head>
    <base href="./" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>silent-renew</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  </head>
  <body>
    <script>
      window.onload = function () {
        /* The parent window hosts the Angular application */
        var parent = window.parent;
        /* Send the id_token information to the oidc message handler */
        var event = new CustomEvent('oidc-silent-renew-message', { detail: window.location });
        parent.dispatchEvent(event);
      };
    </script>
  </body>
</html>

```

**copy provided oidc-client.min.js in assets**

**add new assets path in angular.json**
"assets": [

"src/favicon.ico",

"src/assets",

```

"src/silent-renew.html",

"src/assets/oidc-client.min.js"

```

]

**Add/Change these lines in oidc config**

```
"silent_renew": true,
"silent_renew_url": "https://localhost:44360/silent-renew.html",
```

##Advance Details

**Manually renew token**

```
 this.oidcSecurityService.refreshSession().subscribe((e)=>{
     //logic
})
```

**Cors-Policy Error**

> authentication related api request needs to be unmodified
> write logic in jwt.inceptors


**important links**
[angular-oidc-client documentation](https://nice-hill-002425310.azurestaticapps.net/docs/intro)
[oidc config fields](https://nice-hill-002425310.azurestaticapps.net/docs/documentation/configuration)
