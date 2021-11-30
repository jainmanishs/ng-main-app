import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService, AuthenticationState } from '../authentication';
import { ConfigService } from '@ngx-config/core';
import { Store } from '@ngxs/store';
// import {PlantHealthCheckService} from "../../../../../apps/orion/src/app/services/plant-health-check.service";
import {MatDialog} from "@angular/material";
// import {TranslateService} from "@ngx-translate/core";
// import {FeedbackDialogComponent} from "../../../../../apps/orion/src/app/feedback/feedback-dialog/feedback-dialog.component";
// import {PlantHealthCheckDialog} from "../../../../../apps/orion/src/app/plant-health-check/plant-health-check-dialog/plant-health-check-dialog.component";

@Injectable()
export class PlantHealthCheckGuard implements CanActivate {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    // private plantHealthCheck: PlantHealthCheckService,
    private configService: ConfigService,
    private store: Store
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // return new Promise((resolve, reject) => {
    //   this.plantHealthCheck.checkHealth().then(result => {
    //     if (result.status !== undefined && result.status == "healthy") {
    //       resolve(true);
    //     } else {
    //       const dialogRef = this.dialog.open(PlantHealthCheckDialog, {
    //         disableClose: false,
    //         width: '50%',
    //         panelClass: 'plant-check-health-panel'
    //       });
    //       resolve(false);
    //     }
    //   }).catch(err => {
    //     const dialogRef = this.dialog.open(PlantHealthCheckDialog, {
    //       disableClose: false,
    //       width: '50%',
    //       panelClass: 'plant-check-health-panel'
    //     });
    //     resolve(false);
    //   });
    // })
    return true;


  }
}
