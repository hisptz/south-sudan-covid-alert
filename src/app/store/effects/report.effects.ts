import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { ReportRrtService } from 'src/app/shared/services/report-rrt.service';
import { loadEvents } from '../actions';
import {
  updateReportToRRT,
  updateReportToRRTSuccess,
  updateReportToRRTFailure,
} from '../actions/report.actions';

@Injectable()
export class ReportEffects {
  constructor(
    private actions$: Actions,
    private reportService: ReportRrtService
  ) {}

  @Effect()
  loadAnalyticsData(): Observable<Action> {
    return this.actions$.pipe(
      ofType(updateReportToRRT),
      mergeMap((action) => {
        return this.reportService.reportToRRT(action.data, action.id).pipe(
          map((data) => {
            return loadEvents();
          }),
          catchError((error: any) => {
            return of(updateReportToRRTFailure({ error }));
          })
        );
      })
    );
  }
}
