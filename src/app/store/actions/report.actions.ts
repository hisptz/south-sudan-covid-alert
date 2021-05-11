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

export const addCaseNumber = createAction(
  '[Report] Add Case Number',
  props<{ data: any, id: string }>()
);

export const addCaseNumberSuccess = createAction(
  '[Report] Add Case Number Success',
  props<{ data: any }>()
);

export const addCaseNumberFailure = createAction(
  '[Report] Add Case Number Failure',
  props<{ error: any }>()
);