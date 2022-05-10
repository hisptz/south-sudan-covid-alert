import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EventsService } from 'src/app/shared/services/events.service';
import * as fromActions from '../actions';
import { AppState } from '../reducers';

@Injectable()
export class EventEffects {
  constructor(
    private actions$: Actions,
    private eventsService: EventsService,
    private store: Store<AppState>,
  ) {}
  loadEvents$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.loadEventsByProgramId),
        switchMap((action) =>
          this.eventsService.getEvents().pipe(
            map((response: any) => {
              return this.store.dispatch(
                fromActions.loadEventsByProgramIdSuccess({ events: response, isCompleted: true }),
              );
            }),
            catchError((error: Error) => {
              this.store.dispatch(
                fromActions.loadEventsByProgramIdFailure({ error }),
              );
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
}
