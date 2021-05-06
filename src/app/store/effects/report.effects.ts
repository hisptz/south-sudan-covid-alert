import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private reportService: ReportRrtService,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  updateReportToRRT(): Observable<Action> {
    return this.actions$.pipe(
      ofType(updateReportToRRT),
      mergeMap((action) => {
        return this.reportService.reportToRRT(action.data, action.id).pipe(
          map((data) => {
            this.snackBar.open('Reported to RRT successfully', null ,{
              duration: 3000,
            });
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
