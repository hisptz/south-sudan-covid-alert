import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { ReportRrtService } from 'src/app/shared/services/report-rrt.service';
import { loadEventsByProgramId } from '../actions';
import {
  updateReportToRRT,
  updateReportToRRTSuccess,
  updateReportToRRTFailure,
  addCaseNumber,
  addCaseNumberFailure,
} from '../actions/report.actions';

@Injectable()
export class ReportEffects {
  constructor(
    private actions$: Actions,
    private reportService: ReportRrtService,
    private snackBar: MatSnackBar,
  ) {}

  @Effect()
  updateReportToRRT(): Observable<Action> {
    return this.actions$.pipe(
      ofType(updateReportToRRT),
      mergeMap((action) => {
        return this.reportService.reportToRRT(action.data, action.id).pipe(
          map((data) => {
            this.snackBar.open('Reported to RRT successfully', null, {
              duration: 3000,
            });
            return loadEventsByProgramId();
          }),
          catchError((error: any) => {
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
        return this.reportService
          .saveCaseNumber({ data: action.data, eventId: action.id })
          .pipe(
            map((data) => {
              this.snackBar.open('Case number updated successfully', null, {
                duration: 3000,
              });
              return loadEventsByProgramId();
            }),
            catchError((error: any) => {
              return of(addCaseNumberFailure({ error }));
            }),
          );
      }),
    );
  }
}
