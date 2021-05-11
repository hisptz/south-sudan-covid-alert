import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import * as fromActions from '../actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AnalyticsService } from 'src/app/shared/services';
import { EventsService } from 'src/app/shared/services/events.service';

@Injectable()
export class PageStateEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private analyticsService: AnalyticsService,
    private eventsService: EventsService
  ) {}

  loadEvents$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.loadEvents),
        switchMap((action) =>
          this.analyticsService.loadEvents1().pipe(
            map((response: any) =>
              this.store.dispatch(fromActions.addEvents({ payload: response })),
            ),
            catchError((error: Error) => {
              this.store.dispatch(fromActions.loadEventsFailure({ error }));
              return of(
                fromActions.loadNotification({
                  payload: { message: error.message, statusCode: 500 },
                }),
              );
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  loadOrgUnitsAncestors$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.loadOrgUnitsAncestors),
        switchMap((action) =>
          this.analyticsService
            .loadOrgUnitDataWithAncestors(action.orgUnitIds)
            .pipe(
              map((response: any) => {
                return this.store.dispatch(
                  fromActions.loadOrgUnitsAncestorsSuccess({ data: response }),
                );
              }),
              catchError((error: Error) => {
               // this.store.dispatch(fromActions.loadEventsFailure({ error }));
                return of(
                  fromActions.loadNotification({
                    payload: { message: error.message, statusCode: 500 },
                  }),
                );
              }),
            ),
        ),
      ),
    { dispatch: false },
  );

  addEvents$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.addEvents),
        switchMap((action) =>
          this.analyticsService.getEventListing(action.payload).pipe(
            map((response: Array<any>) => {
              return this.store.dispatch(
                fromActions.addEventsSuccess({ events: response }),
              );
            }),
            catchError((error: Error) =>
              of(
                fromActions.loadNotification({
                  payload: { message: error.message, statusCode: 500 },
                }),
              ),
            ),
          ),
        ),
      ),
    { dispatch: false },
  );
}
