import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { ReportRrtService } from 'src/app/shared/services/report-rrt.service';
import { loadEventsByProgramId } from '../actions';
import {
  updateReportToRRT,
  updateReportToRRTFailure,
  addCaseNumber,
  addCaseNumberFailure,
} from '../actions/report.actions';
import { AppState } from '../reducers';
import * as fromActions from '../actions';
import { EventsService } from 'src/app/shared/services';

@Injectable()
export class ReportEffects {
  constructor(
    private actions$: Actions,
    private reportService: ReportRrtService,
    private eventsService: EventsService,
    private store: Store<AppState>,
  ) {}

  @Effect()
  updateReportToRRT(): Observable<Action> {
    return this.actions$.pipe(
      ofType(updateReportToRRT),
      mergeMap((action) => {
        return this.reportService.reportToRRT(action.data, action.id).pipe(
          map((data) => {
            this.store.dispatch(
              fromActions.showNotification({
                message: 'Reported to RRT successfully',
              }),
            );
            return loadEventsByProgramId();
          }),
          catchError((error: any) => {
            this.store.dispatch(
              fromActions.showNotification({
                message: error?.message || 'Failed to report to rrt',
              }),
            );
            return of(updateReportToRRTFailure({ error }));
          }),
        );
      }),
    );
  }
  @Effect()
  AddCaseNumber(): Observable<Action> {
    return this.actions$.pipe(
      ofType(addCaseNumber),
      mergeMap((action) => {
        return this.eventsService
          .updateCaseNumber({ data: action.data, eventId: action.id })
          .pipe(
            map((data) => {
              this.store.dispatch(
                fromActions.showNotification({
                  message: 'Case number updated successfully',
                }),
              );
              return loadEventsByProgramId();
            }),
            catchError((error: any) => {
              this.store.dispatch(
                fromActions.showNotification({
                  message: error?.message || 'Failed to update case number',
                }),
              );
              return of(addCaseNumberFailure({ error }));
            }),
          );
      }),
    );
  }
}
