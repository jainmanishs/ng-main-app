import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { UserSettings, UserSettingsCls } from 'src/app/all-models/etc.model';
import { DashboardPanelModel } from 'src/app/all-models/sv-dashboard';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@ngx-config/core';
import { AuthenticationService, AuthenticationState } from 'libs/core/src';
import { OidcConfigService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
 
  
  isLoading
  constructor(
    private http: HttpClient,
    private store: Store,
    private configService: ConfigService,
    private authService: AuthenticationService
  ) {
    this.apiUrl = this.configService.getSettings('apiBaseUrl');
    this.userSettingsUrl = this.configService.getSettings('userSettingsService');
  }

  ngOnInit() {
    this.authService.setRedirectUrl("/dashbaord");

    this.tokens.push(this.authService.getIdToken());
    this.demonstrateTokenRenewal();
   console.log(this.authService.getPayloadFromIdToken());
    // this.setTime(self);
  }


   dashboardData;
   readonly DASHBOARD_KEY = "svDashboard";
   apiUrl: string;
   userSettingsUrl;

  async getDashboardData() {
    this.isLoading=true;
    let settings = await this.getUserSettings(this.DASHBOARD_KEY).toPromise().catch(() => {
      settings = undefined;
    });
    settings = plainToClass(UserSettingsCls, settings);
    if (settings && settings.key) {
      //this.dashboardAlreadySaved = true;
      this.dashboardData = plainToClass(DashboardPanelModel, JSON.parse(settings.data) as DashboardPanelModel[]);
    }
    else {
      
      //this.data = plainToClass(DashboardPanelModel, this.supplyVisibilityService.SVDefaultDashboard);
    }
    this.assignIdIfMissing(this.dashboardData);
    for (let index = 0; index < this.dashboardData.length; index++) {
      const element = this.dashboardData[index];
    }
    this.isLoading=false;

  }
  assignIdIfMissing(data: DashboardPanelModel[]) {
    for (let index = 0; index < data.length; index++) {
      DashboardPanelModel.assignIdIfMissing(data[index]);
    }
  }
  getUserSettings(
    dashboard: string
  ): Observable<any> {
    const plant = this.store.selectSnapshot(AuthenticationState.getActiveplant);
    return this.http.get<UserSettings>(`${this.getApiUrlUserSettings('')}${dashboard}-${plant}`, {});
  }
  getApiUrlUserSettings(action: string) {
    return `${this.userSettingsUrl}${this.configService.getSettings(
      'modulesBaseUrl.materialManagement.userSettings'
    )}/${action}`;
  }


  tokens = [];
  generateNewToken(){
    this.authService.renewToken();

  }
  demonstrateTokenRenewal() {
    const self = this;
    setInterval(function () {
      //this code runs every second 
      const recentToken = self.authService.getIdToken();
      if (!self.tokens.find(e => { return e == recentToken })) {
        self.tokens.push(recentToken);
        self.isLoading=false;
      }
    }, 3000);
  }
  setTime(self) {
    setInterval(function () {
      //this code runs every second 
      self.time++;
    }, 60000);
  }
  renewTokenTimeout=-1;
  renewTokenInterval=null;
  renewTokenOnSpecifiedTime(timeOut){

    this.stopRenewTokenTimeout();
    this.renewTokenTimeout = timeOut;
    const self=this
    this.renewTokenInterval= setInterval(function () {
     if(self.renewTokenTimeout<1){
      this.isLoading=true;
      self.generateNewToken();
        clearInterval(self.renewTokenInterval)
        self.renewTokenTimeout = -1;

     }else{
       self.renewTokenTimeout--;
     }
    }, 1000);
  }
  stopRenewTokenTimeout(){
    this.isLoading=false;
    if(this.renewTokenInterval){
      clearInterval(this.renewTokenInterval);
    }
    this.renewTokenTimeout =-1;
  }



}
