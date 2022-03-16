import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { PageState, NotificationState } from '../../shared/models';
import { NotificationType } from 'src/app/shared/models/config.model';

export const loadNotification = createAction(
  '[PageState/API] Load Notification',
  props<{ payload: any }>(),
);

export const showNotification = createAction(
  '[PageState/API] Show notification',
  props<{ message: string; notificationType?: NotificationType }>(),
);

export const updateNotification = createAction(
  '[PageState/API] Update Notification',
  props<{ payload: NotificationState }>(),
);
