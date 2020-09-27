import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { PageState, NotificationState } from '../models';

export const downloadDashboardGraphs = createAction(
  '[PageState/API] Download Dashbord Graphs',
  props<{ payload: boolean }>()
);

export const addPageState = createAction(
  '[PageState/API] Add PageState',
  props<{ pageState: PageState }>()
);

export const upsertPageState = createAction(
  '[PageState/API] Upsert PageState',
  props<{ pageState: PageState }>()
);

export const addPageStates = createAction(
  '[PageState/API] Add PageStates',
  props<{ pageStates: PageState[] }>()
);

export const upsertPageStates = createAction(
  '[PageState/API] Upsert PageStates',
  props<{ pageStates: PageState[] }>()
);

export const updatePageState = createAction(
  '[PageState/API] Update PageState',
  props<{ pageState: Update<PageState> }>()
);

export const updatePageStates = createAction(
  '[PageState/API] Update PageStates',
  props<{ pageStates: Update<PageState>[] }>()
);

export const deletePageState = createAction(
  '[PageState/API] Delete PageState',
  props<{ id: string }>()
);

export const updateNotification = createAction(
  '[PageState/API] Update Notification',
  props<{ payload: NotificationState }>()
);

export const updateNotificationStatus = createAction(
  '[PageState/API] Update Notification Status',
  props<{ payload: boolean }>()
);
export const clearPageStates = createAction('[PageState/API] Clear PageStates');
