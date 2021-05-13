import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as fromActions from '../actions';




@Injectable()
export class PageStateEffects {



  constructor(private actions$: Actions,  private _snackBar: MatSnackBar) {}
  showNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.showNotification),
        tap(({message, notificationType}) =>{
          this._snackBar.open( message, null, {
            duration: 3000,
          });
        }
          
        ),
      ),
    { dispatch: false },
  );

}
