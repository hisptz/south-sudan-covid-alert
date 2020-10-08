import { createAction, props } from '@ngrx/store';

export const updateReportToRRT = createAction(
  '[Report] Update Report To RRT',
  props<{ data: any, id: string }>()
);

export const updateReportToRRTSuccess = createAction(
  '[Report] Update Report Success',
  props<{ data: any }>()
);

export const updateReportToRRTFailure = createAction(
  '[Report] Update Report Failure',
  props<{ error: any }>()
);
