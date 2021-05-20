import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
// import { of } from 'rxjs/observable/of';
import { CurrentUserService } from '../../shared/services';
import * as fromActions from '../actions';
import { AppState } from '../reducers';
import { CurrentUser } from '../../shared/models';

@Injectable()
export class CurrentUserEffects {
  systemInfo: any;
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private currentUserService: CurrentUserService
  ) {}

  loadCurrentUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.loadCurrentUser),
        switchMap((action) =>
          this.currentUserService.loadUser().pipe(
            map((currentUser: CurrentUser) =>
              this.store.dispatch(
                fromActions.addCurrentUser({ payload: currentUser })
              )
            ),
            catchError((error: Error) =>
              of(
                this.store.dispatch(
                  fromActions.updateNotification({
                    payload: { message: error.message, statusCode: 500 },
                  })
                )
              )
            )
          )
        )
      ),
    { dispatch: false }
  );

  loadSytemInfo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.addCurrentUser),
        switchMap((action) =>
          this.currentUserService.loadSystemInfo().pipe(
            map((systemInfo) =>
              this.store.dispatch(
                fromActions.addSystemInfo({ payload: systemInfo })
              )
            ),
            catchError((error: Error) =>
              of(
                this.store.dispatch(
                  fromActions.updateNotification({
                    payload: { message: error.message, statusCode: 500 },
                  })
                )
              )
            )
          )
        )
      ),
    { dispatch: false }
  );
}
