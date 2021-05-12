import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { PageState, NotificationState } from '../models';

export const loadNotification = createAction(
  '[PageState/API] Load Notification',
  props<{ payload: any }>(),
);

export const showNotification = createAction(
  '[PageState/API] Show notification',
  props<{ payload: boolean }>(),
);

export const updateNotification = createAction(
  '[PageState/API] Update Notification',
  props<{ payload: NotificationState }>(),
);