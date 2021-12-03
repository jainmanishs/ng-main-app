import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { UserSettings, UserSettingsCls } from 'src/app/all-models/etc.model';
import { DashboardPanelModel } from 'src/app/all-models/sv-dashboard';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@ngx-config/core';
import { AuthenticationService, AuthenticationState } from 'libs/core/src';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public readonly DASHBOARD_KEY = "svDashboard";
  private apiUrl: string;
  private userSettingsUrl;
  tokens = [];
  checkedTimes: number = 0;
  time: number = 0;
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
    // const self=this;
    // this.tokens.push(self.authService.getIdToken());
    // this.demonstrateTokenRenewal();
    // this.setTime(self);
  }


  dashboardData;
  isLoading
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
      debugger
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

  demonstrateTokenRenewal() {
    const self = this;
    setInterval(function () {
      //this code runs every second 
      const recentToken = self.authService.getIdToken();
      if (!self.tokens.find(e => { return e == recentToken })) {
        self.tokens.push(recentToken);
      }
      self.checkedTimes++;
    }, 20000);
  }
  setTime(self) {
    setInterval(function () {
      //this code runs every second 
      self.time++;
    }, 60000);
  }

}
