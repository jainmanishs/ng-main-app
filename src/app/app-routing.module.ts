import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationGuard } from 'libs/core/src';
import { App1SharedModule } from 'projects/ng-app-one/src/app/app.module';
import { App2SharedModule } from 'projects/ng-app-two/src/app/app.module';
import { DashboardComponent } from './private/dashboard/dashboard.component';
import { LoginComponent } from './public/login/login.component';
import { UnauthorizedComponent } from './public/unauthorized/unauthorized.component';


export const routes: Routes = [
  {
    path: 'app1',
    loadChildren: '../../projects/ng-app-one/src/app/app.module#App1SharedModule'
  },
  {
    path: 'app2',
    loadChildren: '../../projects/ng-app-two/src/app/app.module#App2SharedModule'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
    data: {
      breadcrumb: 'login'
    }
  },
  {
    path: 'home',
    component: LoginComponent,
    data: {
      preload: true,
      breadcrumb: 'login'
    }
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      preload: true,
      breadcrumb: 'dashboard'
    },
    //canActivate:[AuthorizationGuard]
  }

 ];
@NgModule({
  imports: [RouterModule.forRoot(routes),
    App1SharedModule.forRoot(),
    App2SharedModule.forRoot()],
  exports: [RouterModule]
})
export class AppRoutingModule { }
