import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CurrentUser } from '../../shared/models';

export const loadCurrentUser = createAction(
  '[CurrentUser/API] Load CurrentUsers',
);

export const addCurrentUser = createAction(
  '[CurrentUser/API] Add CurrentUser',
  props<{ payload: CurrentUser }>(),
);

export const addSystemInfo = createAction(
  '[CurrentUser/API] Add System Info',
  props<{ payload: any }>(),
);

export const upsertCurrentUsers = createAction(
  '[CurrentUser/API] Upsert CurrentUsers',
  props<{ currentUsers: CurrentUser[] }>(),
);

export const updateCurrentUser = createAction(
  '[CurrentUser/API] Update CurrentUser',
  props<{ currentUser: Update<CurrentUser> }>(),
);

export const updateCurrentUsers = createAction(
  '[CurrentUser/API] Update CurrentUsers',
  props<{ currentUsers: Update<CurrentUser>[] }>(),
);

export const deleteCurrentUser = createAction(
  '[CurrentUser/API] Delete CurrentUser',
  props<{ id: string }>(),
);

export const deleteCurrentUsers = createAction(
  '[CurrentUser/API] Delete CurrentUsers',
  props<{ ids: string[] }>(),
);

export const clearCurrentUsers = createAction(
  '[CurrentUser/API] Clear CurrentUsers',
);
