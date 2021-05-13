import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import * as fromPageState from './page-state.reducer';
import * as fromCurrentUser from './current-user.reducer';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { eventReducer, EventState } from './event.reducer';

export interface AppState {
  pageState: fromPageState.State;
  currentUser: fromCurrentUser.State;
  router: RouterReducerState;
  events: EventState;
}

export const reducers: ActionReducerMap<AppState> = {
  pageState: fromPageState.reducer,
  currentUser: fromCurrentUser.reducer,
  router: routerReducer,
  events: eventReducer,
};

export const getRootState = (state: AppState) => state;

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
