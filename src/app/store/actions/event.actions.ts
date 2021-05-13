import { createAction, props } from '@ngrx/store';
import { EventResponse } from '../models/events.model';

export const loadEventsByProgramId = createAction(
  '[Events] Load Events By Program ID',
);

export const loadEventsByProgramIdSuccess = createAction(
  '[Events] Load Events Success By Program ID',
  props<{ events: Array<EventResponse> }>(),
);

export const loadEventsByProgramIdFailure = createAction(
  '[Events] Load Events Failure By Program ID',
  props<{ error: any }>(),
);
