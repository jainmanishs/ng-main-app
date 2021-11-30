import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class NotificationService {
  constructor(private snackBar: MatSnackBar, private zone: NgZone) { }

  /**
   * Shows message in snackbar
   * @param message Success message to display in snackbar to notify user
   */
  showMessage(message: string, duration?: number) {
    this.zone.run(() => {
      this.snackBar.open(message, 'OK', {
        duration: (duration ? duration : 300000)
      });
    });
  }

  /**
   * Shows error in snackbar
   * @param message Error message to display in snackbar to notify user
   * @param duration How long should be displayed
   * @returns MatSnackBarRef The instance of the component making up the content of the snack bar.
   */
  showError(message: string, duration?: number) {
    let snackBarRef = this.zone.run(() => {
      let snackBarRef = this.snackBar.open(message, 'CLOSE', {
        panelClass: ['notification-error'],
        duration: (duration ? duration : 300000)
      });

      return snackBarRef;
    });

    return snackBarRef;
  }

  showErrorOrMessage(error: any, message: string, duration?: number) {
    let msg = error.message ? error.message : message;
    if (error.detail) {
      msg = error.detail;
    }
    if (error.error && error.error.detail) {
      msg = error.error.detail;
    }
    if (msg) {
      return this.showError(msg);
    }
    else {
      console.log(error, message);
      return this.showError("Error occurred, please contact administrator!");
    }
  }
}
