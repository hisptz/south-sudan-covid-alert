import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as CurrentUserActions from '../actions/current-user.actions';
import { CurrentUser } from '../../shared/models';

export const currentUsersFeatureKey = 'currentUsers';

export interface State extends EntityState<CurrentUser> {
  // additional entities state properties
  user: CurrentUser;
  systemInfo: any;
  loading: boolean;
  loaded: boolean;
}

export const adapter: EntityAdapter<CurrentUser> = createEntityAdapter<
  CurrentUser
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  loaded: false,
  user: null,
  systemInfo: {},
});

export const currentUserReducer = createReducer(
  initialState,
  on(CurrentUserActions.addCurrentUser, (state, action) => ({
    ...state,
    user: action.payload,
  })),
  on(CurrentUserActions.addSystemInfo, (state, action) => ({
    ...state,
    systemInfo: action.payload,
    loaded: true,
    loading: false,
  })),
  on(CurrentUserActions.upsertCurrentUsers, (state, action) =>
    adapter.upsertMany(action.currentUsers, state),
  ),
  on(CurrentUserActions.updateCurrentUser, (state, action) =>
    adapter.updateOne(action.currentUser, state),
  ),
  on(CurrentUserActions.updateCurrentUsers, (state, action) =>
    adapter.updateMany(action.currentUsers, state),
  ),
  on(CurrentUserActions.deleteCurrentUser, (state, action) =>
    adapter.removeOne(action.id, state),
  ),
  on(CurrentUserActions.deleteCurrentUsers, (state, action) =>
    adapter.removeMany(action.ids, state),
  ),
  on(CurrentUserActions.clearCurrentUsers, (state) => adapter.removeAll(state)),
);

export function reducer(state: State | undefined, action: Action) {
  return currentUserReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const getUserState = (state: State) => state.user;
export const getUserSystemInfoState = (state: State) => state.systemInfo;
export const getCurrentUserLoadingState = (state: State) => state.loading;
export const getCurrentUserLoadedState = (state: State) => state.loaded;
