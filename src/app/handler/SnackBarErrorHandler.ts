import {ErrorHandler, Injectable, NgZone} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "../../environments/environment";

@Injectable()
export class SnackBarErrorHandler implements ErrorHandler {
  constructor(private readonly snackBar: MatSnackBar, private ngZone: NgZone) {
  }

  public handleError(error: Error | HttpErrorResponse): void {
    let errorMessage = '';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = error.error.message;
    }

    if (!environment.production) console.error(error);

    this.ngZone.run(() => {
      this.snackBar.open(errorMessage, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    });
  }
}
